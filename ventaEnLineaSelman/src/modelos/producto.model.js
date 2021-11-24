const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombre: String,
    precio: Number,
    existencias:Number,
    cantidad_vendida:{ type: Number, default: 0 },
    categoria: {type: Schema.Types.ObjectId, ref : 'categorias'}
})

module.exports = mongoose.model('productos', ProductoSchema)