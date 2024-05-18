// controllers/authController.js
const db = require('../config/db');

// Controlador para la lógica de inicio de sesión
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Realiza una consulta a la base de datos para verificar las credenciales
  db.query('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) {
      console.error('Error al realizar la consulta:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    // Si las credenciales son válidas, responde con un mensaje de éxito
    res.json({ success: true, message: 'Inicio de sesión exitoso' });
  });
};
