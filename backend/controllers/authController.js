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

    if (user.estado === 'bloqueado') {
      return res.status(401).json({ success: false, error: 'account_blocked', message: 'La cuenta está bloqueada. Contacte al administrador.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    const updatedAttempts = user.intentos_login + 1;
    if (!isMatch) {
            
      db.query('UPDATE usuarios SET intentos_login = ? WHERE id = ?', [updatedAttempts, user.id], (err, results) => {
        if (err) {
          console.error('Error al actualizar el contador de intentos fallidos:', err);
        }
      });

      if (updatedAttempts >= 3) {
        db.query('UPDATE usuarios SET estado = "bloqueado" WHERE id = ?', [user.id], (err, results) => {
          if (err) {
            console.error('Error al bloquear la cuenta del usuario:', err);
          }
        });
      }

      return res.status(401).json({ success: false, error: 'invalid_password', message: 'Contraseña incorrecta' });
    }

    // Reiniciar el contador de intentos fallidos si el inicio de sesión es exitoso
    db.query('UPDATE usuarios SET intentos_login = 0 WHERE id = ?', [user.id], (err, results) => {
      if (err) {
        console.error('Error al reiniciar el contador de intentos fallidos:', err);
      }
    });

    req.session.user = user;
    res.json({ success: true, message: 'Inicio de sesión exitoso' });
  });
};


exports.checkAuth = (req, res) => {
  if (req.session.user) {
    res.json({ isLoggedIn: true, userId: req.session.user.id, rol: req.session.user.rol});
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
  db.query('SELECT COUNT(*) AS count FROM estudiantes', (err, results) => {
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
    res.json({ success: true, nombreCompleto: nombreCompleto, userId: user.id, rol: user.rol });
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
// Función para obtener todos los usuarios
exports.getAllUsuarios = (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Error al obtener los usuarios:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    res.json({ success: true, usuarios: results }); // Cambiado a 'usuarios'
  });
};
// Función para obtener todos los usuarios que tienen el rol de docente
exports.getAllDocentes = (req, res) => {
  const rolDocente = 'docente'; // Define el rol que deseas filtrar
  db.query('SELECT * FROM usuarios WHERE rol = ?', [rolDocente], (err, results) => {
    if (err) {
      console.error('Error al obtener los usuarios:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    res.json({ success: true, usuarios: results }); // Cambiado a 'usuarios'
  });
};
// Función para obtener todas las carreras
exports.getAllCarreras = (req, res) => {
  db.query('SELECT * FROM Carreras', (err, results) => {
    if (err) {
      console.error('Error al obtener las carreras:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    res.json({ success: true, carreras: results });
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
  const { email, nombre, apellido, rol, estado } = req.body; // Agrega estado al destructuring

  try {
    // Construir la consulta de actualización dinámicamente
    let query, values;

    if (estado === 'bloqueado') {
      // Si el estado es 'bloqueado', restablecer los intentos de inicio de sesión a 0
      query = 'UPDATE usuarios SET email = ?, nombre = ?, apellido = ?, rol = ?, estado = ?, intentos_login = 0 WHERE id = ?';
      values = [email, nombre, apellido, rol, estado, userId];
    } else {
      // Si el estado es diferente de 'bloqueado', solo actualizar los datos sin modificar los intentos de inicio de sesión
      query = 'UPDATE usuarios SET email = ?, nombre = ?, apellido = ?, rol = ?, estado = ? WHERE id = ?';
      values = [email, nombre, apellido, rol, estado, userId];
    }

    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Error al actualizar el usuario:', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      res.json({ success: true, message: 'Usuario actualizado exitosamente' });
    });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return res.status(500).json({ success: false, message: 'Error al actualizar el usuario' });
  }
};


//CRUD ***************************************************************************************************************************
// Función para crear un nuevo estudiante
exports.createStudent = (req, res) => {
  const { nombre1, nombre2, apellido1, apellido2, id_carrera, fecha_asignacion_tutor, tema_tesis, fecha_aprobacion_tema, estado_estudiante, id_tutor } = req.body;

  db.query(
    'INSERT INTO Estudiantes (nombre1, nombre2, apellido1, apellido2, id_carrera, fecha_asignacion_tutor, tema_tesis, fecha_aprobacion_tema, estado_estudiante, id_tutor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nombre1, nombre2, apellido1, apellido2, id_carrera, fecha_asignacion_tutor, tema_tesis, fecha_aprobacion_tema, estado_estudiante, id_tutor],
    (err, results) => {
      if (err) {
        console.error('Error al crear el estudiante:', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
      res.status(201).json({ success: true, message: 'Estudiante creado exitosamente' });
    }
  );
};

// Función para obtener un estudiante por su ID
exports.getStudentById = (req, res) => {
  const studentId = req.params.id;
  db.query('SELECT * FROM Estudiantes WHERE id_estudiante = ?', [studentId], (err, results) => {
    if (err) {
      console.error('Error al obtener el estudiante:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    }
    res.json({ success: true, student: results[0] });
  });
};

// Función para obtener todos los estudiantes con nombres de carrera y tutor
exports.getAllStudents = (req, res) => {
  db.query('SELECT e.id_estudiante, e.nombre1, e.nombre2, e.apellido1, e.apellido2, c.nombre_carrera, CONCAT(u.nombre, " ", u.apellido) AS nombre_tutor, e.fecha_asignacion_tutor, e.tema_tesis, e.fecha_aprobacion_tema, e.estado_estudiante FROM estudiantes e LEFT JOIN carreras c ON e.id_carrera = c.id_carrera LEFT JOIN usuarios u ON e.id_tutor = u.id', (err, results) => {
    if (err) {
      console.error('Error al obtener los estudiantes:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    res.json({ success: true, students: results });
  });
};

// Función para eliminar un estudiante por su ID
exports.deleteStudentById = (req, res) => {
  const studentId = req.params.id;
  db.query('DELETE FROM Estudiantes WHERE id_estudiante = ?', [studentId], (err, results) => {
    if (err) {
      console.error('Error al eliminar el estudiante:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    }
    res.json({ success: true, message: 'Estudiante eliminado exitosamente' });
  });
};

// Función para actualizar un estudiante por su ID
exports.updateStudentById = (req, res) => {
  const studentId = req.params.id;
  const { nombre1, nombre2, apellido1, apellido2, estado_estudiante, id_tutor } = req.body;

  db.query(
    'UPDATE Estudiantes SET nombre1 = ?, nombre2 = ?, apellido1 = ?, apellido2 = ?, estado_estudiante = ?, id_tutor = ? WHERE id_estudiante = ?',
    [nombre1, nombre2, apellido1, apellido2, estado_estudiante, id_tutor, studentId],
    (err, results) => {
      if (err) {
        console.error('Error al actualizar el estudiante:', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
      }
      res.json({ success: true, message: 'Estudiante actualizado exitosamente' });
    }
  );
};


// Obtener cantidad de estudiantes graduados por tutor
exports.getGraduadosCount = (req, res) => {
  const tutorId = req.params.tutorId;
  db.query('SELECT COUNT(*) AS count FROM estudiantes WHERE estado_estudiante = "Graduado" AND id_tutor = ?', [tutorId], (err, results) => {
    if (err) {
      console.error('Error al obtener el número de estudiantes graduados:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    res.json({ success: true, count: results[0].count });
  });
};

// Obtener cantidad de estudiantes en progreso por tutor
exports.getEnProgresoCount = (req, res) => {
  const tutorId = req.params.tutorId;
  db.query('SELECT COUNT(*) AS count FROM estudiantes WHERE estado_estudiante = "En progreso" AND id_tutor = ?', [tutorId], (err, results) => {
    if (err) {
      console.error('Error al obtener el número de estudiantes en progreso:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    res.json({ success: true, count: results[0].count });
  });
};

// Obtener cantidad de estudiantes retirados por tutor
exports.getRetiradosCount = (req, res) => {
  const tutorId = req.params.tutorId;
  db.query('SELECT COUNT(*) AS count FROM estudiantes WHERE estado_estudiante = "Retirado" AND id_tutor = ?', [tutorId], (err, results) => {
    if (err) {
      console.error('Error al obtener el número de estudiantes retirados:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    res.json({ success: true, count: results[0].count });
  });
};

// Obtener todos los estudiantes a cargo de un tutor específico
exports.getStudentsByTutor = (req, res) => {
  const tutorId = req.params.tutorId;
  db.query(
    `SELECT 
      e.id_estudiante, 
      e.nombre1, 
      e.nombre2, 
      e.apellido1, 
      e.apellido2, 
      c.nombre_carrera, 
      CONCAT(u.nombre, " ", u.apellido) AS nombre_tutor, 
      e.fecha_asignacion_tutor, 
      e.tema_tesis, 
      e.fecha_aprobacion_tema, 
      e.estado_estudiante 
    FROM 
      estudiantes e 
      LEFT JOIN carreras c ON e.id_carrera = c.id_carrera 
      LEFT JOIN usuarios u ON e.id_tutor = u.id 
    WHERE 
      e.id_tutor = ?`, 
    [tutorId], 
    (err, results) => {
      if (err) {
        console.error('Error al obtener los estudiantes:', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
      res.json({ success: true, students: results });
    }
  );
};
