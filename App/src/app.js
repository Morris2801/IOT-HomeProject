const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para manejar CORS si es necesario
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Iniciar servidor
app.listen(port, () => {
    console.log('Servidor corriendo en http://localhost:${port}');
});