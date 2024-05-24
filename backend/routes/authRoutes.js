// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para el inicio de sesión
router.post('/login', authController.login);

// Ruta para verificar la autenticación
router.get('/check-auth', authController.checkAuth);

// Ruta para cerrar sesión
router.post('/logout', authController.logout);

// Ruta protegida que requiere autenticación y rol de administrador
router.get('/admin/dashboard', authMiddleware.requireAuth, authMiddleware.requireRole('administrador'), (req, res) => {
  // Acceso autorizado, enviar datos del dashboard
  res.json({ success: true, message: 'Acceso al dashboard autorizado' });
});

// Rutas para obtener la cantidad de estudiantes, docentes y administradores
router.get('/estudiantes-count', authController.getEstudiantesCount);

// Rutas sin autenticación
router.get('/user', authController.getUser);
router.get('/docentescount', authController.getDocentesCount);
router.get('/administradorescount', authController.getAdministradoresCount);

// CRUD Usuarios
router.post('/usuarios', authController.createUser);
router.get('/usuarios', authController.getAllUsers);
router.get('/usuarios/:id', authController.getUserById);
router.put('/usuarios/:id', authController.updateUserById);
router.delete('/usuarios/:id', authController.deleteUserById);

module.exports = router;
