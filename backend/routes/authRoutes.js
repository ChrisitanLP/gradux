// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para el inicio de sesión
router.post('/login', authController.login);
router.get('/check-auth', authController.checkAuth);
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
router.get('/estudiantescount', authController.getEstudiantesCount);
router.get('/administradorescount', authController.getAdministradoresCount);

// CRUD Usuarios
router.post('/usuarios', authController.createUser);
router.get('/usuarios', authController.getAllUsers);
router.get('/usuarios/:id', authController.getUserById);
router.put('/usuarios/:id', authController.updateUserById);
router.delete('/usuarios/:id', authController.deleteUserById);

// CRUD Estudiantes
router.post('/estudiantes', authController.createStudent);
router.get('/estudiantes', authController.getAllStudents);
router.get('/estudiantes/:id', authController.getStudentById);
router.put('/estudiantes/:id', authController.updateStudentById);
router.delete('/estudiantes/:id', authController.deleteStudentById);

// Rutas para obtener carreras
router.get('/carreras', authController.getAllCarreras);
router.get('/users', authController.getAllUsuarios);
router.get('/teachers', authController.getAllDocentes);

// Ruta para obtener la cantidad de estudiantes graduados por tutor
router.get('/graduados/:tutorId', authController.getGraduadosCount);
router.get('/enprogreso/:tutorId', authController.getEnProgresoCount);
router.get('/retirados/:tutorId', authController.getRetiradosCount);

// Ruta para obtener todos los estudiantes a cargo de un tutor específico
router.get('/bytutor/:tutorId', authController.getStudentsByTutor);

// CRUD Informes
router.post('/informes', authController.createInforme);
router.get('/informes', authController.getAllInformes);
router.get('/informes/:id', authController.getInformeById);
router.put('/informes/:id', authController.updateInformeById);
router.delete('/informes/:id', authController.deleteInformeById);

// Obtener informes por tutor
router.get('/reportsbytutor/:tutorId', authController.getInformesByTutor);
router.get('/reports11bytutor/:tutorId', authController.getInformes11ByTutor);
router.get('/studentsandreportsbytutor/:tutorId', authController.getStudentsAndReportsByTutor);

// Rutas para los informes
router.get('/tiposInforme', authController.getAllTypesReports);
router.get('/studentsbyteachers/:tutorId', authController.getStudentsByUsersId);

// CRUD Actividades
router.post('/actividades', authController.createActivity);
router.get('/actividades', authController.getAllActivities);
router.get('/actividades/:id', authController.getActivityById);
router.put('/actividades/:id', authController.updateActivityById);
router.delete('/actividades/:id', authController.deleteActivityById);

module.exports = router;
