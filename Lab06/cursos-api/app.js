const express = require('express');
const cursoRoutes = require('./routes/cursoRoutes');

const app = express();

// 1. Middleware incorporado: convierte el JSON del body en req.body
app.use(express.json());

// 2. Middleware personalizado de auditoría (Logger)
app.use((req, res, next) => {
  const inicio = Date.now();

  // 'finish' se dispara cuando la respuesta ya se envió al cliente
  res.on('finish', () => {
    const duracion = Date.now() - inicio;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duracion}ms`);
  });

  next();
});

// 3. Rutas
app.use('/api/cursos', cursoRoutes);

// 4. Ruta no encontrada (ninguna capa anterior respondió)
app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: 'Ruta no encontrada' });
});

// 5. Middleware de manejo de errores (4 parámetros, siempre al final)
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.message);

  // Si el JSON enviado está mal formado, es culpa del cliente (400)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ status: 'fail', message: 'JSON mal formado' });
  }

  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor'
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API Express en puerto ${PORT}`));