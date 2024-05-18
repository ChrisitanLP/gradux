const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors'); // Importa el paquete CORS
const app = express();
const PORT = process.env.npm_package_config_port || 5000; // Usar el puerto especificado en package.json o 3000 por defecto

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Usa el middleware de CORS

// Rutas
app.use('/api', authRoutes);

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor en ejecución en el puerto ${PORT}`));
