const { Schema, model } = require('mongoose');

const CategoriaScheme = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    }
});

// Quitar la version y el estado
CategoriaScheme.methods.toJSON = function() {
    const { __v, estado, ...data} = this.toObject();
    return data;
}

module.exports = model('Categoria', CategoriaScheme);