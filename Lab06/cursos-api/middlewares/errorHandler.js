// Middleware para rutas inexistentes (404)
const rutaNoEncontrada = (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Ruta no encontrada' });
};

// Middleware de manejo de errores: debe tener 4 parámetros
const manejadorErrores = (err, req, res, next) => {
  console.error('Error no controlado:', err.message);

  // JSON mal formado enviado por el cliente: error 400
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ status: 'fail', message: 'JSON mal formado' });
  }

  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor'
  });
};

module.exports = { rutaNoEncontrada, manejadorErrores };