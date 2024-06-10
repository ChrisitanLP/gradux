
const { verifyToken } = require('../config/auth');

exports.requireAuth = (req, res, next) => {
  // Obtener el token de la cabecera de autorización
  const token = req.headers['authorization'];

  // Verificar si el token existe
  if (!token) {
    return res.status(401).json({ success: false, message: 'Acceso no autorizado - Token no proporcionado' });
  }

  // Verificar el token JWT
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Acceso no autorizado - Token inválido' });
  }

  // Adjuntar los datos del usuario decodificado al objeto de solicitud para uso posterior
  req.user = decoded;

  // Permitir que la solicitud continúe al siguiente middleware
  next();
};

exports.requireRole = (role) => {
  return (req, res, next) => {
    // Verificar si el usuario tiene el rol adecuado
    if (req.user && req.user.rol === role) {
      // Si tiene el rol adecuado, permitir que la solicitud continúe al siguiente middleware
      next();
    } else {
      // Si no tiene el rol adecuado, devolver un estado de 403 (Prohibido)
      return res.status(403).json({ success: false, message: 'Acceso no autorizado - Rol incorrecto' });
    }
  };
};
