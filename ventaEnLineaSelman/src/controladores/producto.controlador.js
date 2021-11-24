'use strict'

//IMPORTACIONES
const Producto = require('../modelos/producto.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");

function registrarProducto(req,res) {
    var productoModel = new Producto();
    var params = req.body;

    if (params.nombre && params.precio && params.existencias && params.categoria ) {
        productoModel.nombre = params.nombre;
        productoModel.precio = params.precio;
        productoModel.existencias = params.existencias;
        productoModel.categoria = params.categoria;

        Producto.find({ $or: [
            {nombre: productoModel.nombre},
            {precio: productoModel.precio},
            {existencias: productoModel.existencias},
            {categoria: productoModel.categoria}
        ]}).exec((err, productosEncontrados)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion del producto' })  
                
                productoModel.save((err,productoGuardado)=>{
                    if (err) return res.status(500).send({mensaje: 'Error al guardar el Usuario'});   
                    if(req.user.rol=='ROL_ADMIN'){ 
                        if (productoGuardado) {
                            res.status(200).send(productoGuardado)    
                        }else{
                            res.status(404).send({mensaje: 'No se ha podido registrar el Usuario'})
                        }
                    }else{
                        res.status(403).send({mensaje: 'No tiene los permisos'}) 
                    }
                })
            
        })
    }    
}

function obtenerProductos(req, res) {
    Producto.find((err, productosEncontrados)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener Productos'})
        if(!productosEncontrados) return res.status(500),send({mensaje: 'Error en la consulta de Productos'})
            return res.status(200).send({productosEncontrados}) 
    })
}

function obtenerProductoID(req,res) {
    var idProducto = req.params.idProducto
    Producto.findById(idProducto, (err,productosEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion del Producto'})
        if(!productosEncontrado) return res.status(500).send({mensaje: 'Error en obtener los datos del Producto'})
            //console.log(productosEncontrado.nombre,productosEncontrado.precio,productosEncontrado.existencias,productosEncontrado.categoria);
            return res.status(200).send({productosEncontrado});   
    })
}

function editarProducto(req,res) {
    var idProducto = req.params.idProducto;
    var params = req.body;

    Producto.findByIdAndUpdate(idProducto, params, { new: true }, (err,productoActualizado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticions'});
        if(!productoActualizado) return res.status(500).send({mensaje: 'No se ha podido actualizar el Usuario'});
        if(req.user.rol=='ROL_ADMIN'){ 
             return res.status(200).send({productoActualizado});   
        }else{
            res.status(403).send({mensaje: 'No tiene los permisos'}) 
        }  
     })
}

function eliminarProducto(req,res) {
    const idProducto = req.params.idProducto;
    if(req.user.rol=='ROL_ADMIN'){ 
        Producto.findByIdAndDelete(idProducto,(err,productoEliminado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion de eliminar'});
            if(!productoEliminado) return res.status(500).send({mensaje: 'Error al eliminar el usuario.'});
            return res.status(200).send({productoEliminado});     
        })
    }else{
        res.status(403).send({mensaje: 'No tiene los permisos'}) 
    }  
}

function obtenerCantidadProductos(req,res) {
    var idProducto = req.params.idProducto
    Producto.find({ idProducto:idProducto }).countDocuments().exec((err,cantidadProductos)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion"})
        if(!cantidadProductos) return res.status(500).send({mensaje: "Error en la consulta de los productos"})
        if(req.user.rol=='ROL_ADMIN'){ 
            return res.status(200).send({cantidadProductos})
        }else{
            res.status(403).send({mensaje: 'No tiene los permisos'}) 
       }  
    })  
}

function obtenerProductoNombre(req,res) {
    var nombre = req.body.nombre
       Producto.find({nombre:nombre} ,(err,productoEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de la categoria'})
        if(!productoEncontrado) return res.status(500).send({mensaje: 'Error en obtener los datos del producto'}) 
           return res.status(200).send({productoEncontrado})
    })
}

module.exports = {
    registrarProducto,
    obtenerProductos,
    obtenerProductoID,
    editarProducto,
    eliminarProducto,
    obtenerCantidadProductos,
    obtenerProductoNombre
}