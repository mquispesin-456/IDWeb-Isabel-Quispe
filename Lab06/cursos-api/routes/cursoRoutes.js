const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

router.get('/', cursoController.obtenerCursos);
router.post('/', cursoController.crearCurso);

router.get('/:id', cursoController.obtenerCursoPorId);
router.put('/:id', cursoController.actualizarCurso);
router.delete('/:id', cursoController.eliminarCurso);

module.exports = router;