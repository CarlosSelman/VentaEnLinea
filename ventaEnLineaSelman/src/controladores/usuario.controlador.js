'use strict'

//IMPORTACIONES
const Usuario = require('../modelos/usuario.model');
const Carrito = require('../modelos/carrito.model');
const Categoria = require('../modelos/categoria.model');
const Factura = require('../modelos/factura.model');
const Producto = require('../modelos/producto.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");

function crearUsuarioEstatico(req,res) {
    var  usuarioModel = new Usuario(); 
    usuarioModel.usuario = 'ADMIN';
    usuarioModel.password = '123456';
    usuarioModel.rol = 'ROL_ADMIN';
 
    Usuario.find({ $or: [
     {usuario: usuarioModel.usuario}
     ]}).exec((err, usuariosEncontrados)=>{
     if (err) return console.log('Error en la peticion del Usuario')  
     
     if (usuariosEncontrados 
         && usuariosEncontrados.length >=1) {
         return console.log('Ya existe')
     }else{
         bcrypt.hash('123456',null,null,(err, passwordEncriptada)=>{
             usuarioModel.password = passwordEncriptada;

             usuarioModel.save((err,usuarioGuardado)=>{
                 if (err) return console.log('Error al guardar el Usuario');
                     
                 if (usuarioGuardado) {
                     return console.log(usuarioGuardado)    
                 }else{
                     return console.log( 'No se ha podido registrar el Usuario')
                 }
             })
         })
 
     }
 })
 }

function registrar(req,res) {
    var usuarioModel = new Usuario();
    var params = req.body;

    if (params.usuario && params.email && params.password) {
        usuarioModel.nombre = params.nombre;
        usuarioModel.usuario = params.usuario;
        usuarioModel.email = params.email;
        usuarioModel.rol='ROL_CLIENTE';
        usuarioModel.imagen = null;

        Usuario.find({ $or: [
            {usuario: usuarioModel.usuario},
            {email: usuarioModel.email}
        ]}).exec((err, usuariosEncontrados)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion del Usuario' })  
            if (usuariosEncontrados && usuariosEncontrados.length >=1) {
                return res.status(500).send({mensaje: 'Ya existe'})
            }else{
                bcrypt.hash(params.password,null,null,(err, passwordEncriptada)=>{
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err,usuarioGuardado)=>{
                        if (err) return res.status(500).send({mensaje: 'Error al guardar el Usuario'});   
                        if (usuarioGuardado) {
                            res.status(200).send(usuarioGuardado)    
                        }else{
                            res.status(404).send({mensaje: 'No se ha podido registrar el Usuario'})
                        }
                    })
                })
            }
        })
    }    
}

function obtenerUsuarios(req, res) {
    Usuario.find((err, usuariosEncontrados)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener Usuarios'})
        if(!usuariosEncontrados) return res.status(500),send({mensaje: 'Error en la consulta de Usuarios'})
         //usuariosEncontrados === [datos] || !usuariosEncontrados === [] <-- no trae nada
        if(req.user.rol=='ROL_ADMIN'){ 
            return res.status(200).send({usuariosEncontrados})
        }else{
           res.status(403).send({mensaje: 'No tiene los permisos'}) 
       }  
    })
}

function login(req,res) {
    var params = req.body;

    Usuario.findOne({ usuario: params.usuario },(err,usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});

        if (usuarioEncontrado) {  //TRUE O FALSE
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passCorrecta)=>{
                if(passCorrecta){
                    if (params.obtenerToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(usuarioEncontrado)
                        });
                    }else{
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({usuarioEncontrado})
                    }
                }else{
                    return res.status(404).send({ mensaje:'El usuario no se a podido identificar'})
                }
            })
        }else{
            return res.status(404).send({ mensaje:'El usuario no  a podido ingresar'})
        }
    })
}

function editarUsuario(req,res) {
    var idUsuario = req.params.idUsuario;
    var params = req.body;
    delete params.password;
    Usuario.findByIdAndUpdate(idUsuario, params, {new: true, useFindAndModify: false}, (err,usuarioActualizado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticions'});
        if(!usuarioActualizado) return res.status(500).send({mensaje: 'No se ha podido actualizar el Usuario'});
        if(req.user.rol=='ROL_ADMIN' || idUsuario == req.user.sub){
             return res.status(200).send({usuarioActualizado});   
        }else{
            res.status(403).send({mensaje: 'No tiene los permisos'}) 
        }  
     })
}

function eliminarUsuario(req,res) {
    const idUsuario = req.params.idUsuario;  
    if(req.user.rol=='ROL_ADMIN'){
        Usuario.findByIdAndDelete(idUsuario,(err,usuarioEliminado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion de eliminar'});
            if(!usuarioEliminado) return res.status(500).send({mensaje: 'Error al eliminar el usuario.'});
            return res.status(200).send({usuarioEliminado});     
        })
    }else{
        return res.status(500).send({mensaje: 'No posee los permisos para eliminar a este Usuario.'});
    }
}

function obtenerCantidadUsuarios(req,res) {
    var idUsuario = req.params.idUsuario
    Usuario.find({ idUsuario:idUsuario }).countDocuments().exec((err,cantidadUsuarios)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion"})
        if(!cantidadUsuarios) return res.status(500).send({mensaje: "Error en la consulta de los usuarios"})
      //  if(idUsuario != req.user.sub) return res.status(500).send({mensaje: "No tiene los permisos necesarios"})
        if(req.user.rol=='ROL_ADMIN'){ 
            return res.status(200).send({cantidadUsuarios})
        }else{
            res.status(403).send({mensaje: 'No tiene los permisos'}) 
       }  
    })  
}

function agregarAlCarrito(req, res) {
    var carrito = new Carrito();
    var idUsuario = req.user.sub;
    var params = req.body;

    Usuario.findById(idUsuario, (err, userFound) => {
        if (err) {
            return res.status(500).send({ message: "Error en general" });
        } else if (userFound) {
            var productos = userFound.carrito;
            var productExists;
            var index;
            var monto = 0;

            for (var i = 0; i < productos.length; i++) {
                if (productos[i].idProducto == params.idProducto) {
                    index = i;
                    productExists = productos[index];
                    console.log(productos[index]);
                    break;
                }
            }

            if (productExists) {
                Producto.findById(productExists.idProducto, (err, productFound) => {
                    if (err) {
                        return res.status(500).send({ message: "Error en general" });
                    } else if (productFound) {
                        let existencias = productFound.existencias;
                        let nuevaCantidad =
                            parseInt(productExists.cantidad) + parseInt(params.cantidad);
                        monto = nuevaCantidad * parseInt(productFound.precio);

                        if (nuevaCantidad > existencias) {
                            return res.status(400).send({ message: "No hay la cantidad suficiente en existencia", existencias });
                        } else {
                            Usuario.findOneAndUpdate({ _id: idUsuario, "carrito._id": productExists._id }, {
                                    "carrito.$.cantidad": nuevaCantidad,
                                    "carrito.$.monto": monto,
                                }, { new: true },
                                (err, userUpdated) => {
                                    if (err) {
                                        return res.status(500).send({ message: "Error en general" });
                                    } else if (userUpdated) {
                                        return res.send({ message: "usuario", userUpdated });
                                    } else {
                                        return res .status(404) .send({ message: "Error para actualizar el carrito" });
                                    }
                                }
                            );
                        }
                    } else {
                        return res .status(404) .send({ message: "No se encontro el producto" });
                    }
                });
            } else {
                if (params.idProducto && params.cantidad) {
                    Producto.findById(params.idProducto, (err, productFound) => {
                        if (err) {
                            return res.status(500).send({ message: "Error general" });
                        } else if (productFound) {
                            var existencias = parseInt(productFound.existencias);

                            if (existencias >= params.cantidad && !(existencias <= 0)) {
                                var precio = parseInt(productFound.precio);
                                monto = parseInt(params.cantidad) * precio;

                                carrito.idProducto = params.idProducto;
                                carrito.cantidad = params.cantidad;
                                carrito.monto = monto;

                                Usuario.findByIdAndUpdate(
                                    idUsuario, { $push: { carrito: carrito } }, { new: true },
                                    (err, userUpdate) => {
                                        if (err) {
                                            return res.status(500).send({ message: "Error en general", err });
                                        } else if (userUpdate) {
                                            return res.send({
                                                message: "Se agrego el producto al carrito",
                                                userUpdates: userUpdate,
                                            });
                                        } else {
                                            return res.status(403).send({ message: "No se pudo agregar al carrito" });
                                        }
                                    }
                                );
                            } else {
                                return res .status(403).send({ message: "No existen suficientes productos en existencia" });
                            }
                        } else {
                            return res.status(404).send({
                                message: "No se encontro el producto que desea agregar al carrito :(",
                            });
                        }
                    });
                } else {
                    return res.status(403).send({ message: "Por favor ingrese los datos" });
                }
            }
        } else {}
    }).populate();
}

function productoMasVendido(req, res) {
    Producto.find({}).sort({ cantidad_vendida: "desc" })
    .limit(1)
    .exec((err, productos) => {
            if (err) {
                return res.status(500).send({ message: "Error general" });
            } else if (productos) {
                return res.send({
                    message: "El producto mas vendido... : ",
                    productos,
                });
            } else {
                return res.status(404).send({ message: "No hay productos" });
            }
        });
}

module.exports = {
    crearUsuarioEstatico,
    registrar,
    obtenerUsuarios,
    login,
    editarUsuario,
    eliminarUsuario,
    obtenerCantidadUsuarios,

    agregarAlCarrito,
    productoMasVendido
}