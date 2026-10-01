// ===== 1. REFERENCIAS AL DOM =====
const form = document.querySelector('#task-form');
const inputTitulo = document.querySelector('#titulo');
const inputCurso = document.querySelector('#curso');
const inputFecha = document.querySelector('#fechaEntrega');
const alertas = document.querySelector('#alertas');
const list = document.querySelector('#task-list');

// ===== 2. ESTADO Y PERSISTENCIA =====
const cargar = () => {
    try {
        const datos = JSON.parse(localStorage.getItem('tasks'));
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return []; // si el JSON está dañado, empezamos vacío
    }
};

const guardar = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

let tasks = cargar();

// ===== 3. ALERTAS Y VALIDACIÓN =====
const mostrarAlerta = (mensaje) => {
    alertas.innerHTML = '';
    const div = document.createElement('div');
    div.className = 'alert alert-danger';
    div.textContent = mensaje;
    alertas.appendChild(div);
};

const validar = (titulo, curso, fechaEntrega) => {
    if (!titulo || !curso || !fechaEntrega) {
        return 'Todos los campos son obligatorios.';
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fecha = new Date(fechaEntrega + 'T00:00:00');
    if (fecha <= hoy) {
        return 'La fecha de entrega debe ser posterior a hoy.';
    }
    return null; // null significa que no hay error
};

// ===== 4. RENDERIZADO =====
const renderTasks = () => {
    list.innerHTML = '';
    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';

        const titulo = document.createElement('strong');
        titulo.textContent = task.titulo;

        const detalle = document.createElement('div');
        detalle.className = 'small text-muted';
        detalle.textContent = `${task.curso} · Entrega: ${task.fechaEntrega}`;

        if (task.completada) titulo.classList.add('tarea-completada');

        li.append(titulo, detalle);
        list.appendChild(li);
    });
};

// ===== 5. EVENTO SUBMIT =====
form.addEventListener('submit', (e) => {
    e.preventDefault(); // evita que la página se recargue

    const titulo = inputTitulo.value.trim();
    const curso = inputCurso.value.trim();
    const fechaEntrega = inputFecha.value;

    const error = validar(titulo, curso, fechaEntrega);
    if (error) {
        mostrarAlerta(error);
        return;
    }

    alertas.innerHTML = '';
    tasks.push({
        id: Date.now(),
        titulo,
        curso,
        fechaEntrega,
        completada: false
    });
    guardar();
    renderTasks();
    form.reset();
});

// ===== 6. CARGA INICIAL =====
document.addEventListener('DOMContentLoaded', renderTasks);