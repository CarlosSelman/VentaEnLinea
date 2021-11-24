'use strict'

//IMPORTACIONES
const express = require("express");
const facturaControlador = require("../controladores/factura.controlador")

//MIDDLEWARES
var md_autenticacion = require("../middlewares/authenticated")

//RUTAS
var api = express.Router();

api.get('/obtenerTodasLasFacturas',md_autenticacion.ensureAuth,facturaControlador.obtenerTodasLasFacturas);
api.post('/obtenerLasFacturasDelCliente/:idUsuario',md_autenticacion.ensureAuth,facturaControlador.obtenerLasFacturasDelCliente);
api.post('/obtenerProductosFactura/:idProducto',md_autenticacion.ensureAuth,facturaControlador.obtenerProductosFactura);
api.get('/obtenerProductosAgotados',md_autenticacion.ensureAuth,facturaControlador.obtenerProductosAgotados);
api.post('/crearFactura',md_autenticacion.ensureAuth,facturaControlador.crearFactura);
api.get('/obtenerProductoMasVendido',md_autenticacion.ensureAuth,facturaControlador.obtenerProductoMasVendido);

module.exports = api;