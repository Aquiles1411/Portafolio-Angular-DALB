'use strict'

//Usar esquema de BD
let Project = require('../models/project');
const mongoose = require('mongoose');
const { exists } = require('../models/project');
const path = require('path');
const fs = require('fs');

var controlador = {
    home: function (req, res) {
        //req = peticion, res=respuesta
        //(datos recibidos desde el cliente,respuesta)
        return res.status(200).send({
            mensaje: 'Estas en la home'
        });
    },
    test: function (req, res) {
        return res.status(200).send({
            mensaje: "Accion test del controlador project"
        });
    },

    /*Guarda la informacion enviada por POST en la BD*/
    //colocar ruta en routes
    saveProject: function(req, res) {
        //crear objeto JSON con la estructura importada
        let project = new Project();

        console.log("SaveProject",req.body);

        let parametros = req.body;
        project.name = parametros.name;
        project.description = parametros.description;
        project.category = parametros.category;
        project.year = parametros.year;
        project.langs = parametros.langs;
        project.image = null;

        project.save((error,projectStored) =>{
            if (error) {
                return res.status(500).send({mensaje:"Error al guardar el documento"});
            }

            if (!projectStored) {
                return res.status(404).send({mensaje:"No se ha podido guardar el proyecto"});
            }

            res.status(200).send({project: projectStored});
        });

        //prueba de respuesta
        /*return res.status(200).send({
            params: project,
            mensaje: "metodo saveProject funcionando"
        });*/
    },

    /* OBTENER UN SOLO REGISTRO */

    getProject: function(req, res) {
        let projectId = req.params.id;

        //si no hay datos que mostar
        if (projectId == null) return res.status(404).send({mensaje:"El proyecto no existe"});

        //Metodo de mongoose para buscar objetos por ID en la BD
        Project.findById(projectId, (err,proyecto) =>{

            //Si hay un error en la consulta
            if (err) return res.status(500).send({mensaje: "Error al devolver los datos"});

            //si no hay archivos a ver
            if (!proyecto) return res.status(404).send({mensaje:"El proyecto no existe"});

            //si no se cumplen las condiciones anteriores retorna la informacion
            return res.status(200).send({proyecto});

        });
    },

    /* OBTENER MULTIPLES REGISTROS */

    getProjects: function(req,res) {

        //saca todos los documentos dentro de una coleccion
        //En los parametros se puede colocar condicionales EJ: {year:2019} muestra los registros cuya propiedad año sea 2019
        //sort() metodo para ordenar por una propiedad "opcional", el + invierte el orden "ascendente,descendente"
        Project.find({}).sort('+year').then((proyectos)=>{
            return res.status(200).send({proyectos});
        }).catch(()=>{
            return res.status(404).send({mensaje:"Error inesperado"});
        });
        /* Version de peticion corta usando promesas */

        /*PETICION POR FUNCION EXEC() USANDO CALLBACKS (mas codigo)

        Project.find({}).sort('+year').exec((err,proyectos) =>{

            //Si hay un error en la consulta
            if(err) return res.status(500).send({mensaje:"Error al devolver los datos"});

            //Si no llegan proyectos
            if(!proyectos) return res.status(404).send({mensaje:"No hay proyectos disponibles"});

            //si no se cumple lo anterior, retorna los proyectos
            return res.status(200).send({proyectos});

        })*/
        
    },

    /* EDITAR REGISTRO */

    updateProject: function(req,res) {

        //recoge valores por URL
        let projectId = req.params.id;
        let update = req.body;

        //{new:true} Devuelve el nuevo archivo
        Project.findByIdAndUpdate(projectId, update, {new:true},(err,projectUpdated)=>{

            if (err) return res.status(505).send({mensaje:"Error en la operacion"});

            if (!projectUpdated) return res.status(404).send({mensaje:"No hay datos que actualizar"});

            return res.status(200).send({
                projecto:projectUpdated
            });

        });
        
    },

    /* BORRAR REGISTRO */

    deleteProject: function(req,res) {

        //recoge valores por URL
        let projectId = req.params.id;

        Project.findByIdAndRemove(projectId,(err,projectDeleted)=>{

            if (err) return res.status(505).send({mensaje:"Error en la operacion"});

            if (!projectDeleted) return res.status(404).send({mensaje:"No hay datos que borrar"});

            return res.status(200).send({
                projecto:projectDeleted
            });

        });
        
    },

    /* SUBIR IMAGENES */

    uploadImage: function(req,res) {

        let fileName = 'Error en la carga de la imagen';

        //Comprobar si existe el modulo para cargar las imagenes
        //console.log("PRIMERO",req.files);
        //console.log("Archivo req",req);

        
       if (req.files) {
          //console.log("IMAGENES:",req.files);

            //Busca la propiedad Path del objeto JSON de la imagen cargada
            let filePath = '';
            for (var key in req.files) {
  
                console.log(key);
                filePath = req.files[key].path;
              }
           // console.log(filePath);
            //Separa el id de la imagen de la ruta separada por el caracter (depende del SO)
            let fileSplit = filePath.split('\\');
            let fileName = fileSplit[1];
            let extSplit = fileName.split('.');
            let fileExt = extSplit[1];

            //console.log("VALOR ID:", extSplit[0]);

            //fileName = mongoose.Types.ObjectId.createFromHexString(extSplit[0].trim());

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
               // console.log("NOMBRE IMAGEN:",fileName);

                Project.findByIdAndUpdate(req.params.id, {image: fileName.toString()},{new: true}, (err, projectUpdated) => {
                    if (err) return res.status(500).send({mensaje: 'la imagen no se ha subido: '+err});

                    if (!projectUpdated) return res.status(404).send({mensaje: 'El proyecto no existe'});

                    return res.status(200).send({
                        project: projectUpdated
                    });

                });
                
            }else{
                return res.status(500).send({mensaje: 'La extension no es valida'})
            }

           // console.log(req.files);
    
        }else{

            return res.status(500).send({
                mensaje: fileName
            });
        }
        
    },

    /*Traer imagenes */
    getImageFile: function (req, res) {
        let archivo = req.params.imagen;
        let path_file = './img/'+archivo;
        //path es un modulo de nodeJS por lo que se cambia el nombre de la variable

        //console.log(req.params);

        //si la ruta existe
        fs.stat(path_file, (err,stats) =>{
            if (stats) {
                return res.sendFile(path.resolve(path_file))
            }else{
                return res.status(200).send({mensaje: "No existe la imagen... "+err});
            }
        })
    },

    detailProject:function(req,res){
        let id=req.params.id;
        //find({_id: ObjectId("5f7ba4d92f1bbd5a38ed2544")}) //forma correcta de consultar en mongodb
        Project.find({_id: id}).exec((err,project)=>{
            if(err){
                return res.status(500).send({message: "Error al consultar"});
            }else if(!project){
                return res.status(404).send({message: "Proyecto no encontrado"});
            }else{
                return res.status(200).send({project});
            }
        });
    }   

};



module.exports = controlador;