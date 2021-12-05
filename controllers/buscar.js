const {response} = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Prodcuto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuario = async( termino = '', res = response ) => {

    // si es id de mongo valido
    const esMongoID = ObjectId.isValid(termino);  // TRUE

    if(esMongoID) {
        const usuario = await Usuario.findById(termino);

        // si existe el usuario se envia una arreglo con el resultado, si no existe se envia un arreglo vacio
        return res.json({
            results: (usuario) ? [usuario] : [] 
        });
    }

    // regwx insesnible no importa si es mayuscula o minuscula
    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        // $or: [{nombre: regex }, {correo: regex, estado: true}],
        $or: [{nombre: regex }, {correo: regex}],
        $and: [{estado: true}]
    });

    res.json({
        results: usuarios
    })

}

const buscarCategorias = async( termino = '', res = response ) => {

    // si es id de mongo valido
    const esMongoID = ObjectId.isValid(termino);  // TRUE

    if(esMongoID) {
        const categoria = await Categoria.findById(termino);

        // si existe la categoria se envia una arreglo con el resultado, si no existe se envia un arreglo vacio
        return res.json({
            results: (categoria) ? [categoria] : [] 
        });
    }

    // regwx insesnible no importa si es mayuscula o minuscula
    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({nombre: regex, estado:true });

    res.json({
        results: categorias
    })
}

const buscarProductos = async( termino = '', res = response ) => {

    // si es id de mongo valido
    const esMongoID = ObjectId.isValid(termino);  // TRUE

    if(esMongoID) {
        const producto = await Prodcuto.findById(termino).populate('categoria', 'nombre');

        // si existe la categoria se envia una arreglo con el resultado, si no existe se envia un arreglo vacio
        return res.json({
            results: (producto) ? [producto] : [] 
        });
    }

    // regwx insesnible no importa si es mayuscula o minuscula
    const regex = new RegExp(termino, 'i');

    const productos = await Prodcuto.find({nombre: regex, estado:true }).populate('categoria', 'nombre');

    res.json({
        results: productos
    })
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if(!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son : ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
    case 'usuarios':
        buscarUsuario(termino, res);
        break;
    case 'categorias':
        buscarCategorias(termino, res);
        break;
    case 'productos':
        buscarProductos(termino, res);

        break;

    default: 
        res.send(500).json({
            msg: 'Se me olvido hacer esta busqueda'
        })
    }
}

module.exports = {
    buscar
}