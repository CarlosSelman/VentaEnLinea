'use strict'
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    usuario: String,
    email:String,
    password:String,
    rol: String,
    imagen: String,
    carrito: [{
        idProducto: { type: Schema.ObjectId, ref: "productos" },
        cantidad: { type: Number, default: 0 },
        monto: Number, 
    }, ],
    facturas: [{ type: Schema.ObjectId, ref: "factura" }],
})
module.exports = mongoose.model('usuarios', UsuarioSchema)
