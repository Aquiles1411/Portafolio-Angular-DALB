'use strict'

//Para usar un modelo se usa Mongoose
var mongoose = require('mongoose');
var Esquema = mongoose.Schema;

//molde para crear objetos en la BD
var EsquemaProyectos = Esquema({
    name: String,
    description: String,
    category: String,
    year: Number,
    langs: String,
    image: String
});

//al exportar la coleccion a la BD si esta coleccion no exista mongoose la transcribe
//a minusculas y plural (projects)
//(nombre coleccion, esquema)
module.exports = mongoose.model('proyectos',EsquemaProyectos);