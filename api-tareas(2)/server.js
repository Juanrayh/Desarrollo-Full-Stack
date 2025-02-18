const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Clave secreta para JWT
const SECRET_KEY = 'secreto123';

// Cargar tareas desde archivo
async function cargarTareas() {
    try {
        const data = await fs.readFile('tareas.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Guardar tareas en archivo
async function guardarTareas(tareas) {
    await fs.writeFile('tareas.json', JSON.stringify(tareas, null, 2));
}

// Middleware de autenticación
function verificarToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ mensaje: 'Acceso denegado' });
    try {
        const verificado = jwt.verify(token, SECRET_KEY);
        req.usuario = verificado;
        next();
    } catch (error) {
        res.status(400).json({ mensaje: 'Token no válido' });
    }
}

// Rutas CRUD para tareas
app.get('/tareas', verificarToken, async (req, res) => {
    const tareas = await cargarTareas();
    res.json(tareas);
});

app.post('/tareas', verificarToken, async (req, res) => {
    const { titulo, descripcion } = req.body;
    if (!titulo || !descripcion) return res.status(400).json({ mensaje: 'Faltan datos' });
    const tareas = await cargarTareas();
    const nuevaTarea = { id: Date.now(), titulo, descripcion };
    tareas.push(nuevaTarea);
    await guardarTareas(tareas);
    res.json(nuevaTarea);
});

app.put('/tareas/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;
    const tareas = await cargarTareas();
    const tarea = tareas.find(t => t.id == id);
    if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    tarea.titulo = titulo || tarea.titulo;
    tarea.descripcion = descripcion || tarea.descripcion;
    await guardarTareas(tareas);
    res.json(tarea);
});

app.delete('/tareas/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    let tareas = await cargarTareas();
    tareas = tareas.filter(t => t.id != id);
    await guardarTareas(tareas);
    res.json({ mensaje: 'Tarea eliminada' });
});

// Rutas de autenticación
let usuarios = [];

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    usuarios.push({ username, password: hashedPassword });
    res.json({ mensaje: 'Usuario registrado' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const usuario = usuarios.find(u => u.username === username);
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
        return res.status(400).json({ mensaje: 'Credenciales incorrectas' });
    }
    const token = jwt.sign({ username: usuario.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
