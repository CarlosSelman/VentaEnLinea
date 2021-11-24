"use strict";

//IMPORTACIONES
const Usuario = require('../modelos/usuario.model');
const Carrito = require('../modelos/carrito.model');
const Categoria = require('../modelos/categoria.model');
const Factura = require('../modelos/factura.model');
const Producto = require('../modelos/producto.model');

function obtenerTodasLasFacturas(req, res) {
    Usuario.find()
        .populate("facturas")
            .select("facturas")
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).send({ message: "Error en general" });
            } else if (usuarios) {
                var usuariosFacturas = usuarios.filter(
                    (element) => element.usuariosFacturas.length > 0
                );
                return res.send({
                    message: "facturas",
                    facturas: usuariosFacturas,
                });
            } else {
                return res.status(404).send({ message: "No existen" });
            }
        });
}

function obtenerProductoMasVendido(req, res) {
    Producto.find({})
        .sort({ cantidad_vendida: "desc" })
            .limit(1)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).send({ message: "Error general... :(" });
            } else if (productos) {
                return res.send({
                    message: "El producto mas vendido: ",
                    productos,
                });
            } else {
                return res.status(404).send({ message: "No hay productos :(" });
            }
        });
}

function obtenerLasFacturasDelCliente(req, res) {
    var idUsuario = req.params.idUsuario;
    if (!idUsuario) {
        return res.status(404).send({ message: "Ingresar el ID por favor..." });
    } else {
        Usuario.findById(idUsuario)
            .populate("facturas")
                .select("facturas")
            .exec((err, usuarios) => {
                if (err) {
                    return res.status(500).send({ message: "Error en general" });
                } else if (usuarios) {
                    if (usuarios.facturas.length > 0) {
                        return res.send({
                            message: "facturas",
                            facturas: usuarios,
                        });
                    } else {
                        return res.send({
                            message: "No tiene factura",
                            facturas: usuarios,
                        });
                    }
                } else {
                    return res.status(404).send({ message: "No existe el usuario" });
                }
            });
    }
}

function obtenerProductosFactura(req, res) {
    let idFactura = req.params.idFactura;
    if (idFactura) {
        Factura.findById(idFactura, (err, productosFactura) => {
                if (err) {
                    return res.status(500).send({ message: "Error en general   :D" });
                } else if (productosFactura) {
                    return res.send({
                        message: "Productso de la factura",
                        productos: productosFactura.carrito,
                    });
                } else {
                    return res.status(404).send({ message: "No existe la factura :(" });
                }
            })
            .populate("carrito.idProducto")
            .select("idProducto");
    } else {
        return res.status(400).send({ message: "Ingrese el ID por favor" });
    }
}

function obtenerProductosAgotados(req, res) {
    Producto.find({ existencias: 0 }, (err, productos) => {
        if (err) {
            return res.status(500).send({ message: "Error en general :(" });
        } else if (productos) {
            return res.send({ message: "Productos agotados... : ", productos });
        } else {
            return res.status(404).send({ message: "No se ha agotado ningun producto" });
        }
    });
}

function crearFactura(req, res) {
    var factura = new Invoice();
    var idUsuario = req.user.sub;
    Usuario.findById(idUsuario, (err, user) => {
    if (err) {
        return res.status(500).send({ message: "Error :(", err });
    } else if (usuarios) {
        var productos = usuarios.carrito; 
        if (productos) {
            var idProducto = 0;
            var cantidad = 0;
            var totalAPagar = 0;
            factura.carrito = [];
            
            for (var index = 0; index < productos.length; index++) {
            factura.carrito.push(productos[index]);
            totalAPagar += parseInt(productos[index].monto);

            idProducto = productos[index].idProducto;
            cantidad = productos[index].cantidad;

            Producto.findById(idProducto, (err, productos) => {
            if (err) {
                return res .status(500) .send({ message: "Error :(" });
            } else if (productos) {
                var nuevaExistencia = parseInt(productos.existencias) - parseInt(cantidad);
                var cantidadVendida = parseInt(productos.cantidad_vendida) + parseInt(cantidad);
            
            Producto.findByIdAndUpdate(
            idProducto, { existencias: nuevaExistencia, cantidad_vendida: cantidadVendida},(err, excistenciaModificada) => {
            if (err) {
                return res.status(500).send({
                    message: "Error al actualizar",err,
                });
                } else if (excistenciaModificada) {
                    return;
                } else {
                    return res.status(500).send({ message: "Error... :(" });
                }});
                    } else {
                        return res.status(404).send({ message: "No existe..." });
                    }
                });
            }

            console.log(factura.carrito);
            factura.idUsuario = idUsuario;
            factura.total = totalAPagar;
            factura.save((err, facturaGuardada) => {
                if (err) {
                    return res.status(500).send({ message: "Error al guardar factura", err });
                } else if (facturaGuardada) {
            Usuario.findByIdAndUpdate(
                idUsuario, { $push: { facturas: facturaGuardada._id },carrito: [] },{ new: true },(err, usuarioActualizado) => {
                    if (err) {
                        return res.status(500).send({ message: "Error ... :(" });
                    } else if (usuarioActualizado) {
                        return res.send({
                            message: "Factura creada... :",usuarioActualizado,facturaGuardada,
                        });
                        } else {
                            return res.status(404).send({
                                message: "No se pudo actualizar y agregar la factura",
                            });
                        }});
                    } else {
                        return res.status(403).send({ message: "No se guardo" });
                    }});
            } else {
                return res.status(404).send({ message: "El carrito esta vacio" });
            }
        } else {
         return res.status(404).send({ message: "No se pudo encontrar el usuario",idUsuario});
        }
    });
}

module.exports = {
    obtenerTodasLasFacturas,
    obtenerLasFacturasDelCliente,
    obtenerProductosFactura,
    obtenerProductosAgotados,
    crearFactura,
    obtenerProductoMasVendido
};