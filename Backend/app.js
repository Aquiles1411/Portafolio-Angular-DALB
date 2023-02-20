'use strict'
/* Configuracion de Express */

/*
GET: Consultar
POST: Guardar
PUT: Actualizar
DELETE: Borrar
*/

//objeto para paso de contenido http
//objetos con rutas en el package.json
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

/*CARGAR ARCHIVOS DE RUTAS*/

var rutasPorject = require('./routes/project');

/*MIDDLEWARES*/

//convierte informacion enviada por POST, GET, etc. En un objeto JSON
//se hace primero la configuracion necesaria para el bodyparser
app.use(bodyParser.urlencoded({extended:false}));

//Luego se le dice que cualquier tipo de peticion la convierta a JSON
app.use(bodyParser.json());

/*CORS*/

// Configurar cabeceras y cors para evitar errores en peticiones AJAX (donde va el * se coloca las URL permitidas, esto para una app mas robusta)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


/*RUTAS (esto se encuentra optimizado en el archivo project.js
    en la carpeta controllers y en la carpeta routes)

//app.get('ruta en URL',(datos recibidos desde el cliente,respuesta))
app.get('/test', (req,res) => {
    //respuesta exitosa
    res.status(200).send({
        mensaje: "Hola mundo desde mi API NodeJS"
    });
});

//peticion por POST
app.post('/test/:id', (req,res) => {
    //respuesta exitosa

    //metodo para recoger datos y mostrarlos
    //query se utiliza para recoger datos enviados por URL
    //Body para recoger datos ocultos enviados en el Body
    //params recoge un parametro enviado por URL :id
    console.log(req.body.nombre);
    //http://localhost:7700/test/77?name=alejandro
    console.log(req.query.name);
    console.log(req.params.id);
    
    res.status(200).send({
        mensaje: "Hola desde una peticion POST"
    });
});

//se puede devolver un JSON o un string
app.get('/', (req,res) => {
    //respuesta exitosa
    res.status(200).send("<h1>INDEX</h1>");
});*/

//('prefijo ruta [opcional /prefijo/ruta] o / para solo colocar la ruta',ruta)
app.use('/api',rutasPorject);

/*EXPORTAR*/

//exportar el modulo app: Se exporta la variable app con la configuracion
module.exports = app;