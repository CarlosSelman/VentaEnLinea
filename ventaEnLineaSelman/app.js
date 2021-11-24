'use strict'

//VARIABLES GLOBALES
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")

//IMPORTACION RUTAS
const usuario_ruta = require("./src/rutas/usuario.rutas");
const usuario_controlador = require("./src/controladores/usuario.controlador");
const producto_ruta = require("./src/rutas/producto.rutas");
const producto_controlador = require("./src/controladores/producto.controlador");
const categoria_ruta = require("./src/rutas/categoria.rutas");
const categoria_controlador = require("./src/controladores/categoria.controlador");
const factura_ruta = require("./src/rutas/factura.rutas");
const factura_controlador = require("./src/controladores/factura.controlador");

//MIDDLEWARES
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//CABECERAS
app.use(cors());

//CARGA DE RUTAS localhost:3000/api/obtenerUsuarios
app.use('/api', usuario_ruta,categoria_ruta,producto_ruta,factura_ruta);

usuario_controlador.crearUsuarioEstatico();
categoria_controlador.crearCategoriaPorDefecto();
//EXPORTAR
module.exports = app;