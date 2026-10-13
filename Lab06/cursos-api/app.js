const express = require('express');
const cursoRoutes = require('./routes/cursoRoutes');
const logger = require('./middlewares/logger');
const { rutaNoEncontrada, manejadorErrores } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());   // 1. Parser de JSON (incorporado)
app.use(logger);           // 2. Auditoría (personalizado)

app.use('/api/cursos', cursoRoutes);  // 3. Rutas

app.use(rutaNoEncontrada); // 4. 404
app.use(manejadorErrores); // 5. Errores (siempre al final)

const PORT = 3000;
app.listen(PORT, () => console.log(`API Express en puerto ${PORT}`));