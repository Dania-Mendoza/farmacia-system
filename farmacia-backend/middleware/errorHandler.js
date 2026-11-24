// Middleware global de manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);

  // Errores de Oracle DB
  if (err.errorNum) {
    switch (err.errorNum) {
      case 1: // ORA-00001: Unique constraint violated
        return res.status(409).json({
          success: false,
          message: 'El registro ya existe (restricción de unicidad)',
          detail: err.message,
        });
      case 2291: // ORA-02291: Foreign key constraint violated
        return res.status(400).json({
          success: false,
          message: 'Referencia a registro inexistente (llave foránea)',
          detail: err.message,
        });
      case 2292: // ORA-02292: Child record found
        return res.status(409).json({
          success: false,
          message: 'No se puede eliminar, existen registros dependientes',
          detail: err.message,
        });
      default:
        return res.status(500).json({
          success: false,
          message: 'Error en la base de datos',
          detail: process.env.NODE_ENV === 'development' ? err.message : undefined,
        });
    }
  }

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors,
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    detail: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

// Middleware para rutas no encontradas
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
