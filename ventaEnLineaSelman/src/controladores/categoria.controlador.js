'use strict'

//IMPORTACIONES
const Categoria = require('../modelos/categoria.model');
const Producto = require('../modelos/producto.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");
const { updateMany } = require('../modelos/categoria.model');

function registrarCategoria(req,res) {
    var categoriaModel = new Categoria();
    var params = req.body;

    if (params.nombre) {
        categoriaModel.nombre = params.nombre;

        Categoria.find({ $or: [
            {nombre: categoriaModel.nombre},

        ]}).exec((err, categoriasEncontrados)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion de categoria' })  
            if (categoriasEncontrados && categoriasEncontrados.length >=1) {
                return res.status(500).send({mensaje: 'Ya existe'})
            }else{
                categoriaModel.save((err,categoriaGuardado)=>{
                    if (err) return res.status(500).send({mensaje: 'Error al guardar la categoria'}); 
                    if(req.user.rol=='ROL_ADMIN'){ 
                        if (categoriaGuardado) {
                            res.status(200).send(categoriaGuardado)    
                        }else{
                            res.status(404).send({mensaje: 'No se ha podido registrar la categoria'})
                        }
                    }else{
                        res.status(403).send({mensaje: 'No tiene los permisos'}) 
                    }
                })
            }
        })
    }    
}

function obtenerCategorias(req, res) {
    Categoria.find((err, categoriasEncontrados)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener Categorias'})
        if(!categoriasEncontrados) return res.status(500),send({mensaje: 'Error en la consulta de categorias'})
            return res.status(200).send({categoriasEncontrados}) 
    })
}

function obtenerCategoriaID(req,res) {
    var idCategoria = req.params.idCategoria
    Categoria.findById(idCategoria, (err,categoriasEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de la categoria'})
        if(!categoriasEncontrado) return res.status(500).send({mensaje: 'Error en obtener los datos de la categoria'})
            return res.status(200).send({categoriasEncontrado});   
    })
}

function editarCategoria(req,res) {
    var idCategoria = req.params.idCategoria;
    var params = req.body;

    Categoria.findByIdAndUpdate(idCategoria, params, {new: true, useFindAndModify: false}, (err,categoriaActualizado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!categoriaActualizado) return res.status(500).send({mensaje: 'No se ha podido actualizar la categoria'});
        if(req.user.rol=='ROL_ADMIN'){ 
             return res.status(200).send({categoriaActualizado});   
        }else{
            res.status(403).send({mensaje: 'No tiene los permisos'}) 
        }  
     })
}

function obtenerCantidadCategorias(req,res) {
    var idCategoria = req.params.idCategoria
    Categoria.find({ idCategoria:idCategoria }).countDocuments().exec((err,cantidadCategorias)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion"})
        if(!cantidadCategorias) return res.status(500).send({mensaje: "Error en la consulta de las categorias"})
        if(req.user.rol=='ROL_ADMIN'){ 
            return res.status(200).send({cantidadCategorias})
        }else{
            res.status(403).send({mensaje: 'No tiene los permisos'}) 
       }  
    })  
}

function eliminarCategoria(req,res) {
    const idCategoria = req.params.idCategoria;
    var  categoriaModel = new Categoria();
    categoriaModel.nombre = 'categoriaEstantar';
    if(req.user.rol=='ROL_ADMIN'){
        Categoria.findOne({nombre:'categoriaEstantar'},(err,categoriaPorDefecto)=>{
            Producto.updateMany({categoria:idCategoria},{categoria:categoriaPorDefecto._id},
                (err,productosActualizados)=>{
                    if(err) return res.status(500).send({mensaje: 'Error en la peticion de actualizar'});  
                } 
        )}
        )
        Categoria.findByIdAndDelete(idCategoria,(err,categoriaEliminado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion de eliminar'});
            if(!categoriaEliminado) return res.status(500).send({mensaje: 'Error al eliminar la Categoria.'});   
            return res.status(200).send({categoriaEliminado}); 
        })
        
    }else{
        res.status(403).send({mensaje: 'No tiene los permisos'}) 
    }  
}

function crearCategoriaPorDefecto(req,res) {
    var  categoriaModel = new Categoria(); 
    categoriaModel.nombre = 'categoriaEstantar';

    Categoria.find({ $or: [
     {nombre: categoriaModel.nombre}
     ]}).exec((err, categoriasEncontrados)=>{
     if (err) return console.log('Error en la peticion de categorias')  
     
     if (categoriasEncontrados 
         && categoriasEncontrados.length >=1) {
         return console.log('Ya existe')
     }else{
        categoriaModel.save((err,categoriaGuardado)=>{
            if (err) return console.log('Error al guardar la categoria');
                     
            if (categoriaGuardado) {
                return console.log(categoriaGuardado)    
            }else{
        return console.log( 'No se ha podido registrar la categoria')
        }
        })
     }
 })
 }

function obtenerCategoriaNombre(req,res) {
    var nombre = req.body.nombre
       Categoria.find({nombre:nombre} ,(err,categoriaEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de la categoria'})
        if(!categoriaEncontrado) return res.status(500).send({mensaje: 'Error en obtener los datos de la categoria'}) 
           return res.status(200).send({categoriaEncontrado})
    })
}

function obtenerProductosPorCategoriaNombre(req,res) {
    var nombre = req.body.nombre;
    Categoria.findOne({nombre:nombre} ,(err,categoriaEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de la categoria'})
        if(!categoriaEncontrado) return res.status(500).send({mensaje: 'Error en obtener los datos de la categoria'}) 
        Producto.find({categoria:categoriaEncontrado._id},(err, productosEncontrados)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener Productos'})
            if(!productosEncontrados) return res.status(500),send({mensaje: 'Error en la consulta de Productos'})
                return res.status(200).send({productosEncontrados}) 
        }) 
    })    
} 

module.exports = {
    registrarCategoria,
    obtenerCategorias,
    obtenerCategoriaID,
    editarCategoria,
    obtenerCantidadCategorias,
    obtenerCategoriaNombre,
    obtenerProductosPorCategoriaNombre,
    eliminarCategoria,
    crearCategoriaPorDefecto
}