'use strict'

//IMPORTACIONES
const express = require("express");
const productoControlador = require("../controladores/producto.controlador")

//MIDDLEWARES
var md_autenticacion = require("../middlewares/authenticated")

//RUTAS
var api = express.Router();

api.post('/registrarProducto',md_autenticacion.ensureAuth,productoControlador.registrarProducto);
api.get('/obtenerProductos',md_autenticacion.ensureAuth,productoControlador.obtenerProductos);
api.get('/obtenerCantidadProductos',md_autenticacion.ensureAuth ,productoControlador.obtenerCantidadProductos);
api.post('/obtenerProductoNombre',md_autenticacion.ensureAuth,productoControlador.obtenerProductoNombre);
api.get('/obtenerProductoID/:idProducto',md_autenticacion.ensureAuth,productoControlador.obtenerProductoID);
api.put('/editarProducto/:idProducto',md_autenticacion.ensureAuth ,productoControlador.editarProducto);

api.delete('/eliminarProducto/:idProducto',md_autenticacion.ensureAuth ,productoControlador.eliminarProducto);

module.exports = api;