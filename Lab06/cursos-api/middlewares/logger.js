// Middleware de auditoría: imprime método, URL, código de estado y tiempo de respuesta
const logger = (req, res, next) => {
  const inicio = Date.now();

  // 'finish' se dispara cuando la respuesta ya se envió al cliente
  res.on('finish', () => {
    const duracion = Date.now() - inicio;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duracion}ms`);
  });

  next();
};

module.exports = logger;