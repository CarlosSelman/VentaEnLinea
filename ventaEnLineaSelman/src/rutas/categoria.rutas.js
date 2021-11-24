'use strict'

//IMPORTACIONES
const express = require("express");
const categoriaControlador = require("../controladores/categoria.controlador")

//MIDDLEWARES
var md_autenticacion = require("../middlewares/authenticated")

//RUTAS
var api = express.Router();

api.post('/registrarCategoria',md_autenticacion.ensureAuth,categoriaControlador.registrarCategoria);
api.post('/obtenerCategoriaNombre',md_autenticacion.ensureAuth ,categoriaControlador.obtenerCategoriaNombre);
api.put('/editarCategoria/:idCategoria',md_autenticacion.ensureAuth ,categoriaControlador.editarCategoria);
api.get('/obtenerCategorias',md_autenticacion.ensureAuth,categoriaControlador.obtenerCategorias);
api.delete('/eliminarCategoria/:idCategoria',md_autenticacion.ensureAuth ,categoriaControlador.eliminarCategoria);
api.get('/obtenerCategoriaID/:idCategoria',md_autenticacion.ensureAuth,categoriaControlador.obtenerCategoriaID);
api.get('/obtenerCantidadCategorias',md_autenticacion.ensureAuth ,categoriaControlador.obtenerCantidadCategorias);
api.post('/obtenerProductosPorCategoriaNombre',md_autenticacion.ensureAuth ,categoriaControlador.obtenerProductosPorCategoriaNombre);
module.exports = api;