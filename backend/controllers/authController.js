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
  const { email, nombre, apellido, estado } = req.body; // Agrega estado al destructuring

  try {
    // Construir la consulta de actualización dinámicamente
    let query, values;

    if (estado === 'activo') {
      // Si el estado es 'bloqueado', restablecer los intentos de inicio de sesión a 0
      query = 'UPDATE usuarios SET email = ?, nombre = ?, apellido = ?, estado = ?, intentos_login = 0 WHERE id = ?';
      values = [email, nombre, apellido, estado, userId];
    } else {
      // Si el estado es diferente de 'bloqueado', solo actualizar los datos sin modificar los intentos de inicio de sesión
      query = 'UPDATE usuarios SET email = ?, nombre = ?, apellido = ?, estado = ? WHERE id = ?';
      values = [email, nombre, apellido, estado, userId];
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
  const { nombre1, nombre2, apellido1, apellido2, id_carrera, fecha_asignacion_tutor, tema_tesis, fecha_aprobacion_tema, estado_estudiante, id_tutor, cedula } = req.body;

  db.query(
    'INSERT INTO Estudiantes (nombre1, nombre2, apellido1, apellido2, id_carrera, fecha_asignacion_tutor, tema_tesis, fecha_aprobacion_tema, estado_estudiante, id_tutor, cedula) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nombre1, nombre2, apellido1, apellido2, id_carrera, fecha_asignacion_tutor, tema_tesis, fecha_aprobacion_tema, estado_estudiante, id_tutor, cedula],
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
  db.query('SELECT e.id_estudiante, e.nombre1, e.nombre2, e.apellido1, e.apellido2, e.cedula, c.nombre_carrera, CONCAT(u.nombre, " ", u.apellido) AS nombre_tutor, e.fecha_asignacion_tutor, e.tema_tesis, e.fecha_aprobacion_tema, e.estado_estudiante FROM estudiantes e LEFT JOIN carreras c ON e.id_carrera = c.id_carrera LEFT JOIN usuarios u ON e.id_tutor = u.id', (err, results) => {
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
  const { nombre1, nombre2, apellido1, apellido2, estado_estudiante } = req.body;

  db.query(
    'UPDATE Estudiantes SET nombre1 = ?, nombre2 = ?, apellido1 = ?, apellido2 = ?, estado_estudiante = ? WHERE id_estudiante = ?',
    [nombre1, nombre2, apellido1, apellido2, estado_estudiante, studentId],
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
      e.cedula, 
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

//CRUD ***************************************************************************************************************************
// Función para crear un nuevo informe
exports.createInforme = (req, res) => {
  const { id_tipo_informe, id_estudiante_Per, observaciones, id_usuario_tutor, porcentaje, fecha_aprobacion } = req.body;
    // Verificar el máximo de informes del tipo 1 por estudiante
    const maxInformeTipo1 = id_tipo_informe == 1 ? 5 : Infinity; // Máximo de informes del tipo 1 por estudiante
    db.query('SELECT COUNT(*) AS numInformes FROM informes WHERE id_estudiante_Per = ? AND id_tipo_informe = 1', [id_estudiante_Per], (err, results) => {
      if (err) {
        console.error('Error al contar los informes:', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
      const numInformesTipo1 = results[0].numInformes || 0;
      
      if (numInformesTipo1 >= maxInformeTipo1) {
        return res.status(400).json({ success: false, message: `El estudiante ya tiene el máximo de ${maxInformeTipo1} informes del Anexo 5.` });
      }
  
      // Si no ha alcanzado el máximo, proceder a insertar el informe
      db.query(
        'INSERT INTO informes (id_tipo_informe, id_estudiante_Per, observaciones, id_usuario_tutor, porcentaje, fecha_aprobacion) VALUES (?, ?, ?, ?, ?, ?)',
        [id_tipo_informe, id_estudiante_Per, observaciones, id_usuario_tutor, porcentaje, fecha_aprobacion],
        (err, results) => {
          if (err) {
            console.error('Error al crear el informe:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
          }
          res.status(201).json({ success: true, message: 'Informe creado exitosamente' });
        }
      );
    });
  };

// Función para obtener un informe por su ID
exports.getInformeById = (req, res) => {
  const informeId = req.params.id;
  db.query('SELECT * FROM informes WHERE id_Informe = ?', [informeId], (err, results) => {
    if (err) {
      console.error('Error al obtener el informe:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Informe no encontrado' });
    }
    res.json({ success: true, informe: results[0] });
  });
};

// Función para obtener todos los informes
exports.getAllInformes = (req, res) => {
  db.query('SELECT * FROM informes', (err, results) => {
    if (err) {
      console.error('Error al obtener los informes:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    res.json({ success: true, informes: results });
  });
};

// Función para eliminar un informe por su ID
exports.deleteInformeById = (req, res) => {
  const informeId = req.params.id;

  // Primero eliminamos los registros dependientes en la tabla 'actividades'
  db.query('DELETE FROM actividades WHERE id_informe_corr = ?', [informeId], (err, results) => {
    if (err) {
      console.error('Error al eliminar actividades relacionadas:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }

    // Después eliminamos el informe
    db.query('DELETE FROM informes WHERE id_Informe = ?', [informeId], (err, results) => {
      if (err) {
        console.error('Error al eliminar el informe:', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Informe no encontrado' });
      }
      res.json({ success: true, message: 'Informe eliminado exitosamente' });
    });
  });
};


// Función para actualizar un informe por su ID
exports.updateInformeById = (req, res) => {
  const informeId = req.params.id;
  const { observaciones, porcentaje, fecha_aprobacion } = req.body;

  db.query(
    'UPDATE informes SET observaciones = ?, porcentaje = ?, fecha_aprobacion = ? WHERE id_Informe = ?',
    [observaciones, porcentaje, fecha_aprobacion, informeId],
    (err, results) => {
      if (err) {
        console.error('Error al actualizar el informe:', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Informe no encontrado' });
      }
      res.json({ success: true, message: 'Informe actualizado exitosamente' });
    }
  );
};

// Función para obtener informes Anexo 5 por tutor con actividades relacionadas
exports.getInformesByTutor = (req, res) => {
  const tutorId = req.params.tutorId;

  const query = `
    SELECT 
      i.id_Informe,
      ti.nombreTipo AS tipo_informe,
      ti.titulo,
      e.cedula,
      CONCAT(e.nombre1, ' ', e.nombre2, ' ', e.apellido1, ' ', e.apellido2) AS nombre_completo_estudiante,
      e.tema_tesis,
      e.fecha_asignacion_tutor,
      e.fecha_aprobacion_tema,
      e.estado_estudiante,
      c.nombre_carrera,
      LAST_DAY(CURRENT_DATE()) AS fecha_creacion,
      i.fecha_aprobacion,
      i.observaciones,
      i.porcentaje,
      a.id_actividad,
      a.fecha_Actividad,
      a.nombreActividad
    FROM 
      informes i
      LEFT JOIN tipoinformes ti ON i.id_tipo_informe = ti.id_Tipo
      LEFT JOIN estudiantes e ON i.id_estudiante_Per = e.id_estudiante
      LEFT JOIN actividades a ON i.id_Informe = a.id_informe_corr
      LEFT JOIN carreras c ON e.id_carrera = c.id_carrera
    WHERE 
      i.id_usuario_tutor = ? AND i.id_tipo_informe = 1
  `;

  db.query(query, [tutorId], (err, results) => {
    if (err) {
      console.error('Error al obtener los informes:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron informes para el tutor especificado' });
    }

    // Organizar los resultados en un objeto para agrupar informes con sus actividades
    const informesConActividades = results.reduce((acc, informe) => {
      const { id_Informe, tipo_informe, titulo, cedula, nombre_completo_estudiante, tema_tesis, fecha_creacion, fecha_aprobacion, observaciones, porcentaje, ...actividad } = informe;
      const existingInforme = acc.find(item => item.id_Informe === id_Informe);
      if (existingInforme) {
        existingInforme.actividades.push(actividad);
      } else {
        acc.push({
          id_Informe,
          titulo,
          tipo_informe,
          cedula,
          nombre_completo_estudiante,
          tema_tesis,
          fecha_creacion,
          fecha_aprobacion,
          observaciones,
          porcentaje,
          fecha_asignacion_tutor: informe.fecha_asignacion_tutor,
          fecha_aprobacion_tema: informe.fecha_aprobacion_tema,
          estado_estudiante: informe.estado_estudiante,
          nombre_carrera: informe.nombre_carrera,
          actividades: actividad.id_actividad ? [actividad] : []
        });
      }
      return acc;
    }, []);

    res.json({ success: true, informes: informesConActividades });
  });
};

// Función para obtener informes Anexo 11 por tutor con actividades relacionadas
exports.getInformes11ByTutor = (req, res) => {
  const tutorId = req.params.tutorId;

  const queryAnexo11 = `
    SELECT 
      i.id_Informe,
      ti.nombreTipo AS tipo_informe,
      ti.titulo,
      e.cedula,
      CONCAT(e.nombre1, ' ', e.nombre2, ' ', e.apellido1, ' ', e.apellido2) AS nombre_completo_estudiante,
      e.tema_tesis,
      e.fecha_asignacion_tutor,
      e.fecha_aprobacion_tema,
      e.estado_estudiante,
      c.nombre_carrera,
      LAST_DAY(CURRENT_DATE()) AS fecha_creacion,
      i.fecha_aprobacion,
      i.observaciones,
      i.porcentaje,
      e.id_estudiante
    FROM 
      informes i
      LEFT JOIN tipoinformes ti ON i.id_tipo_informe = ti.id_Tipo
      LEFT JOIN estudiantes e ON i.id_estudiante_Per = e.id_estudiante
      LEFT JOIN carreras c ON e.id_carrera = c.id_carrera
    WHERE 
      i.id_usuario_tutor = ? AND i.id_tipo_informe = 2
  `;

  const queryActividadesAnexo5 = `
    SELECT
      a.id_actividad,
      a.fecha_Actividad,
      a.nombreActividad,
      i.id_estudiante_Per
    FROM 
      actividades a
      LEFT JOIN informes i ON a.id_informe_corr = i.id_Informe
    WHERE 
      i.id_tipo_informe = 1
  `;

  db.query(queryAnexo11, [tutorId], (err, anexo11Results) => {
    if (err) {
      console.error('Error al obtener los informes Anexo 11:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }

    if (anexo11Results.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron informes Anexo 11 para el tutor especificado' });
    }

    db.query(queryActividadesAnexo5, (err, actividadesResults) => {
      if (err) {
        console.error('Error al obtener las actividades:', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }

      const actividadesPorEstudiante = actividadesResults.reduce((acc, actividad) => {
        if (!acc[actividad.id_estudiante_Per]) {
          acc[actividad.id_estudiante_Per] = [];
        }
        acc[actividad.id_estudiante_Per].push(actividad);
        return acc;
      }, {});

      const informesConActividades = anexo11Results.map(informe => {
        return {
          ...informe,
          actividades: actividadesPorEstudiante[informe.id_estudiante] || []
        };
      });

      res.json({ success: true, informes: informesConActividades });
    });
  });
};




exports.getStudentsAndReportsByTutor = (req, res) => {
  const tutorId = req.params.tutorId;
  
  const query = `
    SELECT 
      e.id_estudiante, 
      e.nombre1, 
      e.nombre2, 
      e.apellido1, 
      e.apellido2,
      e.cedula, 
      c.nombre_carrera, 
      CONCAT(u.nombre, " ", u.apellido) AS nombre_tutor, 
      e.fecha_asignacion_tutor, 
      e.tema_tesis, 
      e.fecha_aprobacion_tema, 
      e.estado_estudiante,
      i.id_Informe, 
      ti.nombreTipo AS tipo_informe,
      ti.titulo,
      i.fecha_creacion,
      i.observaciones,
      i.porcentaje,
      i.fecha_aprobacion,
      a.id_actividad,
      a.fecha_Actividad,
      a.nombreActividad
    FROM 
      estudiantes e 
      LEFT JOIN carreras c ON e.id_carrera = c.id_carrera 
      LEFT JOIN usuarios u ON e.id_tutor = u.id 
      LEFT JOIN informes i ON e.id_estudiante = i.id_estudiante_Per
      LEFT JOIN tipoinformes ti ON i.id_tipo_informe = ti.id_Tipo
      LEFT JOIN actividades a ON i.id_Informe = a.id_informe_corr
    WHERE 
      e.id_tutor = ?;`;

  db.query(query, [tutorId], (err, results) => {
    if (err) {
      console.error('Error al obtener los estudiantes y sus informes:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }

    // Objeto para almacenar estudiantes y sus informes agrupados
    const studentsMap = {};
    
    // Procesar cada fila de resultado
    results.forEach(row => {
      const { id_estudiante, id_Informe, nombre1, nombre2, apellido1, apellido2, cedula, 
              nombre_carrera, nombre_tutor, fecha_asignacion_tutor, tema_tesis, 
              fecha_aprobacion_tema, estado_estudiante, tipo_informe, titulo, fecha_creacion, 
              observaciones, porcentaje, fecha_aprobacion, id_actividad, fecha_Actividad, nombreActividad } = row;

      // Si el estudiante aún no está en el mapa, agregarlo con sus datos básicos
      if (!studentsMap[id_estudiante]) {
        studentsMap[id_estudiante] = {
          id_estudiante,
          nombre1,
          nombre2,
          apellido1,
          apellido2,
          cedula,
          nombre_carrera,
          nombre_tutor,
          fecha_asignacion_tutor,
          tema_tesis,
          fecha_aprobacion_tema,
          estado_estudiante,
          informes: []
        };
      }

      // Solo agregar informes del tipo "ANEXO 5"
      if (tipo_informe === 'ANEXO 5') {
        // Buscar si el informe ya existe para este estudiante
        const existingInforme = studentsMap[id_estudiante].informes.find(informe => informe.id_Informe === id_Informe);

        if (existingInforme) {
          // Si el informe ya existe, agregar la actividad a su lista de actividades
          existingInforme.actividades.push({
            id_actividad,
            fecha_Actividad,
            nombreActividad
          });
        } else {
          // Si el informe no existe, agregar un nuevo informe con sus actividades
          studentsMap[id_estudiante].informes.push({
            id_Informe,
            tipo_informe,
            titulo,
            nombre_carrera,
            tema_tesis,
            fecha_aprobacion_tema,
            fecha_creacion,
            observaciones,
            nombre1,
            nombre2,
            apellido1,
            apellido2,
            porcentaje,
            fecha_aprobacion,
            actividades: id_actividad ? [{
              id_actividad,
              fecha_Actividad,
              nombreActividad
            }] : []
          });
        }
      }
    });

    // Convertir el mapa de estudiantes de nuevo a un arreglo
    const students = Object.values(studentsMap);
    res.json({ success: true, students });
  });
};



// Función para obtener todos los tipos de informe
exports.getAllTypesReports = (req, res) => {
  db.query('SELECT * FROM tipoinformes', (err, results) => {
    if (err) {
      console.error('Error al obtener los tipos de informes:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    res.json({ success: true, tiposInforme: results });
  });
};

// Función para obtener estudiantes por tutor por su ID con estado "En Progreso"
exports.getStudentsByUsersId = (req, res) => {
  const tutorId = req.params.tutorId;
  db.query('SELECT * FROM estudiantes WHERE id_tutor = ? AND estado_estudiante = "En progreso"', [tutorId], (err, results) => {
    if (err) {
      console.error('Error al obtener los estudiantes por tutor:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Estudiantes por Tutor no encontrados' });
    }
    res.json({ success: true, estudiantesporDocente: results });
  });
};

//CRUD ***************************************************************************************************************************
// Función para crear un nuevo informe
exports.createActivity = (req, res) => {
  const { fecha_Actividad, nombreActividad, id_informe_corr } = req.body;

  db.query(
    'INSERT INTO actividades ( fecha_Actividad, nombreActividad, id_informe_corr) VALUES (?, ?, ?)',
    [fecha_Actividad, nombreActividad, id_informe_corr],
    (err, results) => {
      if (err) {
        console.error('Error al crear la actividad:', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
      res.status(201).json({ success: true, message: 'Actividad creada exitosamente' });
    }
  );
};

// Función para obtener un informe por su ID
exports.getActivityById = (req, res) => {
  const actividadId = req.params.id;
  db.query('SELECT * FROM actividades WHERE id_actividad = ?', [actividadId], (err, results) => {
    if (err) {
      console.error('Error al obtener la actividad:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Actividad no encontrada' });
    }
    res.json({ success: true, actividad: results[0] });
  });
};

// Función para obtener todos los informes
exports.getAllActivities = (req, res) => {
  db.query('SELECT * FROM actividades', (err, results) => {
    if (err) {
      console.error('Error al obtener las actividades:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    res.json({ success: true, actividades: results });
  });
};

// Función para eliminar un informe por su ID
exports.deleteActivityById = (req, res) => {
  const actividadId = req.params.id;
  db.query('DELETE FROM actividades WHERE id_actividad = ?', [actividadId], (err, results) => {
    if (err) {
      console.error('Error al eliminar la actividad:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Actividad no encontrada' });
    }
    res.json({ success: true, message: 'Actividad eliminada exitosamente' });
  });
};

// Función para actualizar un informe por su ID
exports.updateActivityById = (req, res) => {
  const actividadId = req.params.id;
  const { nombreActividad, fecha_Actividad } = req.body;

  db.query(
    'UPDATE actividades SET nombreActividad = ?, fecha_Actividad = ? WHERE id_actividad = ?',
    [nombreActividad, fecha_Actividad, actividadId],
    (err, results) => {
      if (err) {
        console.error('Error al actualizar la actividad:', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Informe no encontrado' });
      }
      res.json({ success: true, message: 'Actividad actualizada exitosamente' });
    }
  );
};