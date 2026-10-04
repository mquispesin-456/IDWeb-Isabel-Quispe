const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const RUTA_DATOS = path.join(__dirname, 'data', 'estudiantes.json');

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function enviarJSON(res, codigo, objeto) {
  res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(objeto));
}

function servirEstatico(req, res) {
  const ruta = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(__dirname, 'public', ruta);
  const extension = path.extname(filePath);

  fs.readFile(filePath, (err, contenido) => {
    if (err) {
      return enviarJSON(res, 404, { message: 'Recurso no encontrado' });
    }
    res.writeHead(200, { 'Content-Type': TIPOS[extension] || 'text/plain' });
    res.end(contenido);
  });
}

function listarEstudiantes(req, res) {
  fs.readFile(RUTA_DATOS, 'utf8', (err, contenido) => {
    if (err) {
      return enviarJSON(res, 500, { message: 'Error al leer los datos' });
    }
    try {
      const estudiantes = JSON.parse(contenido);
      enviarJSON(res, 200, estudiantes);
    } catch (error) {
      enviarJSON(res, 500, { message: 'El archivo JSON está dañado' });
    }
  });
}

const server = http.createServer((req, res) => {
  console.log(`Petición recibida: ${req.method} ${req.url}`);

  if (req.url === '/api/estudiantes' && req.method === 'GET') {
    return listarEstudiantes(req, res);
  }

  if (req.method === 'GET' && !req.url.startsWith('/api/')) {
    return servirEstatico(req, res);
  }

  enviarJSON(res, 404, { message: 'Recurso no encontrado' });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});