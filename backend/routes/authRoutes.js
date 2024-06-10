// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para el inicio de sesión, solo requiere token
router.post('/login', authMiddleware.requireAuth, authController.login);

// Rutas sin autenticación
router.get('/check-auth', authController.checkAuth);
router.post('/logout', authController.logout);
router.get('/user', authController.getUser);
router.get('/docentescount', authController.getDocentesCount);
router.get('/estudiantescount', authController.getEstudiantesCount);
router.get('/administradorescount', authController.getAdministradoresCount);
router.get('/usuarios', authController.getAllUsers);
router.get('/usuarios/:id', authController.getUserById);
router.get('/estudiantes', authController.getAllStudents);
router.get('/estudiantes/:id', authController.getStudentById);
router.get('/carreras', authController.getAllCarreras);
router.get('/users', authController.getAllUsuarios);
router.get('/teachers', authController.getAllDocentes);
router.get('/graduados/:tutorId', authController.getGraduadosCount);
router.get('/enprogreso/:tutorId', authController.getEnProgresoCount);
router.get('/retirados/:tutorId', authController.getRetiradosCount);
router.get('/bytutor/:tutorId', authController.getStudentsByTutor);

// Ruta protegida que requiere autenticación y rol de administrador
router.get('/admin/dashboard', authMiddleware.requireAuth, authMiddleware.requireRole('administrador'), (req, res) => {
  // Acceso autorizado, enviar datos del dashboard
  res.json({ success: true, message: 'Acceso al dashboard autorizado' });
});

module.exports = router;
