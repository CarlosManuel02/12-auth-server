const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConection } = require('./db/config');
require('dotenv').config(); // para leer las variables de entorno

// console.log(process.env);

// crear el servidor de express
const app = express();

// Base de datos
dbConection(); // llamamos a la función que conecta con la base de datos

// Directorio público
app.use(express.static('public')); // para que cualquier persona pueda acceder a la carpeta public

// Configurar CORS
app.use(cors()); // permite que cualquier aplicación pueda hacer peticiones a mi servidor 

// lectura y parseo del body
app.use(express.json()); // para que el servidor entienda los datos que le llegan en formato json

// puerto de la app
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`); // para que se ejecute en el puerto que le indiquemos en el archivo .env
})


//* Rutas
app.use('/api/auth', require('./routes/auth')); // para que cualquier petición que vaya a /api/auth se redirija al archivo auth.js


// manejar rutas
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
})
