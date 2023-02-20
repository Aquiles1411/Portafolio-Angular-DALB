'use strict'

var express = require('express');

var controladorProyecto = require('../controllers/project');

var router = express.Router();


/*const multer = require('multer');

const storage = multer.diskStorage({
    destination: '../img',
    filename: function(req, file, cb) {
        cb("","imagenes.jpg");
    }
});

const upload = multer({
    storage: storage
});*/

/* MIDLLEWARE: Metodo que se ejecuta antes del controlador */
//npm install multer --view (instala la libreria necesaria) //md_auth

/*const cors = require('cors');
router.use(cors());

var crypto = require('crypto');
var multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, '../img');
    },
    filename(req, file = {}, cb){
        const { originalname } = file;
        const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];

        // cb(null, `${file.fieldname}__${Date.now()}${fileExtension}`);

        crypto.pseudoRandomBytes(16, function (err, raw){
            cb(null, raw.toString('hex') + Date.now() + fileExtension);
        });
    },
});

var mul_upload = multer({dest: '../img',storage});*/

//npm install connect-multiparty --save (ejecutar este comando si es la primera vez en usar esta propiedad)
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './img'});



/*CONFIGURACION DE RUTAS*/

//(nombre ruta URL a designar, funcion de callback importada)
//Por metodo get
router.get('/home',controladorProyecto.home);//Lobby
router.get('/project/:id?',controladorProyecto.getProject);//Buscar registro especifico con un ID
router.get('/projects',controladorProyecto.getProjects);//Devolver todos los registros
router.get('/getImagen/:imagen',controladorProyecto.getImageFile);//Devolver una imagen
router.get("/detalle-proyecto/:id",controladorProyecto.detailProject);
//Por metodo post
router.post('/test',controladorProyecto.test);
router.post('/save-project', controladorProyecto.saveProject);
//aqui se ejecuta un middleware para agregar una funcion antes de que se ejecute el controlador [mul_upload.single('img')]
router.post('/upImage/:id',multipartMiddleware,controladorProyecto.uploadImage); 
//router.post('/upImage/:id', [mul_upload.single('image')],controladorProyecto.uploadImage);
//Por metodo put (Actualizar datos)
router.put('/projectUp/:id',controladorProyecto.updateProject);
//por metodo delete (borrar datos)
router.delete('/projectDe/:id',controladorProyecto.deleteProject);

module.exports = router;