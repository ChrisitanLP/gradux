// middlewares/authMiddleware.js

exports.requireAuth = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: 'Acceso no autorizado' });
    }
    next();
  };
  
  exports.requireRole = (role) => {
    return (req, res, next) => {
      if (req.session.user && req.session.user.rol === role) {
        next();
      } else {
        return res.status(403).json({ success: false, message: 'Acceso no autorizado' });
      }
    };
  };
  