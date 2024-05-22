const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 5000;
const authMiddleware = require('./middlewares/authMiddleware'); // Importar el middleware de autenticación

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // Reemplaza con la URL de tu frontend
  credentials: true
}));

// Configurar la sesión
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambiar a true si se usa HTTPS
}));

// Rutas
app.use('/api', authRoutes);

// Middleware de autenticación para proteger rutas
app.use('/api/admin', authMiddleware.requireAuth); // Protege todas las rutas bajo /api/admin

// Rutas protegidas
app.use('/api/admin', authRoutes); // Utiliza las rutas de autenticación dentro de /api/admin


// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor en ejecución en el puerto ${PORT}`));
