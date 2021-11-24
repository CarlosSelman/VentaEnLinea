'use strict'

//IMPORTACIONES
const express = require("express");
const usuarioControlador = require("../controladores/usuario.controlador")

//MIDDLEWARES
var md_autenticacion = require("../middlewares/authenticated")

//RUTAS
var api = express.Router();

api.post('/registrarUsuario',usuarioControlador.registrar);
api.get('/obtenerUsuarios',md_autenticacion.ensureAuth ,usuarioControlador.obtenerUsuarios);
api.post('/login',usuarioControlador.login);
api.put('/editarUsuario/:idUsuario',md_autenticacion.ensureAuth ,usuarioControlador.editarUsuario);
api.delete('/eliminarUsuario/:idUsuario',md_autenticacion.ensureAuth ,usuarioControlador.eliminarUsuario);
api.get('/obtenerCantidadUsuarios',md_autenticacion.ensureAuth ,usuarioControlador.obtenerCantidadUsuarios);
api.put('/agregarAlCarrito/:idUsuario',md_autenticacion.ensureAuth ,usuarioControlador.agregarAlCarrito);
api.put('/productoMasVendido',md_autenticacion.ensureAuth ,usuarioControlador.productoMasVendido);

module.exports = api;