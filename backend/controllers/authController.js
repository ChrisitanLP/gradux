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


// Nueva función para obtener la información del usuario
exports.getUser = (req, res) => {
  // Suponiendo que `id` del usuario se pasa como un parámetro de consulta en la URL
  const userId = req.query.id;

  db.query('SELECT firstName, lastName FROM usuarios WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error al realizar la consulta:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const user = results[0];
    res.json({ success: true, firstName: user.firstName, lastName: user.lastName });
  });
};
