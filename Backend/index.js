'use strict'
//PARA INICIAR EL SERVIDOR ESCRIBIR EN LA RUTA DEL BACKEND:
//npm start (en cmd)

/*Conexion a base de datos*/

//variable que carga el modulo mongose
var mongoose = require('mongoose');

//configuracion de Express
var app = require('./app');

//puerto del servidor
var port = 7700;

//promesa
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
//(url)
mongoose.connect('mongodb://localhost:27017/portafolio',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
},{ useNewUrlParser:true, useUnifiedTopology: true })
.then(() => {
    //si se conecta
    console.log("Conexion establecida con exito");
    /* Creacion del servidor (puerto, funcion de callback) */
    app.listen(port, () => {
        console.log("Servidor corriendo correctamente en la URL: localhost:"+port);
    });
})
.catch(err => console.log(err));//si no