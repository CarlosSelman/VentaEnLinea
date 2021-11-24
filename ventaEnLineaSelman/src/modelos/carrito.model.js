'use strict'
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CarritoSchema = Schema({
        idProducto: {type: Schema.Types.ObjectId, ref: 'productos'},
        cantidad:{type: Number, default: 0},
        monto: Number,
});
module.exports = mongoose.model('carrito', CarritoSchema)
