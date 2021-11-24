"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FacturaSchema = Schema({
    carrito: [{
        idProducto: { type: Schema.ObjectId, ref: "productos" },
        cantidad: { type: Number, default: 0 },
        monto: Number, 
    }, ],
    fecha: { type: Date, default: Date.now },
    idUsuario: { type: Schema.ObjectId, ref: "usuarios" },
    total: Number,
});

module.exports = mongoose.model("factura", FacturaSchema);