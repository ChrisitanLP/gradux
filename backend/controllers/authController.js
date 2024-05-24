const db = require('../config/db');
const bcrypt = require('bcrypt');
const session = require('express-session');
const express = require('express');
const app = express();

// Configurar la sesión
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambiar a true si se usa HTTPS
}));

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Error al realizar la consulta:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, error: 'invalid_email', message: 'Correo electrónico incorrecto' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'invalid_password', message: 'Contraseña incorrecta' });
    }

    req.session.user = user;
    res.json({ success: true, message: 'Inicio de sesión exitoso' });
  });
};

exports.checkAuth = (req, res) => {
  if (req.session.user) {
    res.json({ isLoggedIn: true });
  } else {
    res.json({ isLoggedIn: false });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'No se pudo cerrar la sesión' });
    }
    res.json({ success: true, message: 'Sesión cerrada correctamente' });
  });
};

// Obtener cantidad de estudiantes
exports.getEstudiantesCount = (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM usuarios WHERE rol = "estudiante"', (err, results) => {
    if (err) {
      console.error('Error al realizar la consulta:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    res.json({ success: true, count: results[0].count });
  });
};


exports.getDocentesCount = (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM usuarios WHERE rol = ?', ['docente'], (err, results) => {
    if (err) {
      console.error('Error al obtener el número de docentes:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    const count = results[0].count;
    res.json({ success: true, count });
  });
};

// Obtener el número de usuarios con rol "administrador"
exports.getAdministradoresCount = (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM usuarios WHERE rol = ?', ['administrador'], (err, results) => {
    if (err) {
      console.error('Error al obtener el número de administradores:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    const count = results[0].count;
    res.json({ success: true, count });
  });
};


exports.getUser = (req, res) => {
  // Suponiendo que `id` del usuario se pasa como un parámetro de consulta en la URL
  const userId = req.query.id;

  db.query('SELECT nombre, apellido FROM usuarios WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error al realizar la consulta:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const user = results[0];
    const nombreCompleto = `${user.nombre} ${user.apellido}`; // Concatenar nombre y apellido
    res.json({ success: true, nombreCompleto: nombreCompleto });
  });
};

//CRUD ***************************************************************************************************************************
// Función para crear un nuevo usuario
exports.createUser = async (req, res) => {
  const { email, password, nombre, apellido, rol } = req.body;
  
  try {
    // Generar el hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
  
    db.query('INSERT INTO usuarios (email, password, nombre, apellido, rol) VALUES (?, ?, ?, ?, ?)', 
      [email, hashedPassword, nombre, apellido, rol], 
      (err, results) => {
        if (err) {
          console.error('Error al crear el usuario:', err);
          return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        res.status(201).json({ success: true, message: 'Usuario creado exitosamente' });
      }
    );
  } catch (error) {
    console.error('Error al generar el hash de la contraseña:', error);
    return res.status(500).json({ success: false, message: 'Error al crear el usuario' });
  }
};

// Función para obtener un usuario por su ID
exports.getUserById = (req, res) => {
  const userId = req.params.id;
  db.query('SELECT * FROM usuarios WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener el usuario:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.json({ success: true, user: results[0] });
  });
};

// Función para obtener todos los usuarios
exports.getAllUsers = (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Error al obtener los usuarios:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    res.json({ success: true, users: results });
  });
};

// Función para eliminar un usuario por su ID
exports.deleteUserById = (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM usuarios WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error al eliminar el usuario:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.json({ success: true, message: 'Usuario eliminado exitosamente' });
  });
};

// Función para actualizar un usuario por su ID
exports.updateUserById = async (req, res) => {
  const userId = req.params.id;
  const { email, password, nombre, apellido, rol } = req.body;
  
  try {
    // Generar el hash de la nueva contraseña, si se proporciona
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
  
    db.query('UPDATE usuarios SET email = ?, password = ?, nombre = ?, apellido = ?, rol = ? WHERE id = ?', 
      [email, hashedPassword, nombre, apellido, rol, userId], 
      (err, results) => {
        if (err) {
          console.error('Error al actualizar el usuario:', err);
          return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, message: 'Usuario actualizado exitosamente' });
      }
    );
  } catch (error) {
    console.error('Error al generar el hash de la contraseña:', error);
    return res.status(500).json({ success: false, message: 'Error al actualizar el usuario' });
  }
};