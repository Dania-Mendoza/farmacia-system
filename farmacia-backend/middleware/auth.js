const jwt = require('jsonwebtoken');

// Middleware de autenticación JWT
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación no proporcionado',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado, inicie sesión nuevamente',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }
};

// Middleware para verificar roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para acceder a este recurso',
      });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
