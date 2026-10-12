const db = require('../data/cursos');

// GET /api/cursos  (y /api/cursos?creditos=4)
exports.obtenerCursos = (req, res) => {
  let resultado = db.cursos;

  // req.query: filtros opcionales que vienen en la URL después del "?"
  const { creditos } = req.query;
  if (creditos !== undefined) {
    resultado = resultado.filter(c => c.creditos === Number(creditos));
  }

  res.status(200).json({
    status: 'success',
    results: resultado.length,
    data: resultado
  });
};

// GET /api/cursos/:id
exports.obtenerCursoPorId = (req, res) => {
  // req.params: valores que vienen dentro de la ruta (siempre son texto)
  const id = Number(req.params.id);
  const curso = db.cursos.find(c => c.id === id);

  if (!curso) {
    return res.status(404).json({ status: 'fail', message: 'Curso no encontrado' });
  }

  res.status(200).json({ status: 'success', data: curso });
};

// POST /api/cursos
exports.crearCurso = (req, res) => {
  // req.body: datos que el cliente envía en formato JSON
  const { nombre, codigo, creditos } = req.body;

  if (!nombre || !codigo || creditos === undefined) {
    return res.status(400).json({
      status: 'fail',
      message: 'Faltan campos obligatorios: nombre, codigo, creditos'
    });
  }

  if (isNaN(Number(creditos)) || Number(creditos) <= 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'creditos debe ser un número mayor que 0'
    });
  }

  db.ultimoId += 1;
  const nuevoCurso = {
    id: db.ultimoId,
    nombre,
    codigo,
    creditos: Number(creditos)
  };

  db.cursos.push(nuevoCurso);
  res.status(201).json({ status: 'success', data: nuevoCurso });
};

// PUT /api/cursos/:id
exports.actualizarCurso = (req, res) => {
  const id = Number(req.params.id);
  const curso = db.cursos.find(c => c.id === id);

  if (!curso) {
    return res.status(404).json({ status: 'fail', message: 'Curso no encontrado' });
  }

  const { nombre, codigo, creditos } = req.body;

  if (creditos !== undefined && (isNaN(Number(creditos)) || Number(creditos) <= 0)) {
    return res.status(400).json({
      status: 'fail',
      message: 'creditos debe ser un número mayor que 0'
    });
  }

  // Solo se actualizan las propiedades que llegaron en el body
  if (nombre !== undefined) curso.nombre = nombre;
  if (codigo !== undefined) curso.codigo = codigo;
  if (creditos !== undefined) curso.creditos = Number(creditos);

  res.status(200).json({ status: 'success', data: curso });
};

// DELETE /api/cursos/:id
exports.eliminarCurso = (req, res) => {
  const id = Number(req.params.id);
  const existe = db.cursos.some(c => c.id === id);

  if (!existe) {
    return res.status(404).json({ status: 'fail', message: 'Curso no encontrado' });
  }

  db.cursos = db.cursos.filter(c => c.id !== id);
  res.status(200).json({ status: 'success', message: 'Curso eliminado correctamente' });
};