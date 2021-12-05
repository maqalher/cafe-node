const { response } = require("express");
const { Prodcuto } = require('../models');

// obtenerProductos - paginado - total - populate
const obtenerProductos = async(req, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, productos] = await Promise.all([
        Prodcuto.countDocuments(query),
        Prodcuto.find({ estado: true })
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.status(200).json({
        total,
        productos
    });
}

// obtenerCategoria - populate
const obtenerProducto = async(req, res) => {
    
    const {id} = req.params;
    const producto = await Prodcuto.findById(id)
                                .populate('usuario', 'nombre')
                                .populate('categoria', 'nombre');

    res.json(producto);
}

const crearProducto = async(req, res = response) => {

    const {estado, usuario, ...body} = req.body;

    const productoDB = await Prodcuto.findOne({nombre: body.nombre});

    if(productoDB) {
        return res.status(400).json({
            msg: `La producto ${productoDB.nombre} ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(), 
        usuario: req.usuario._id
    }

    // console.log(data);
    const producto = new Prodcuto(data);
    
    // Guardar categoria 
    await producto.save();

    res.status(201).json(producto);
}

// actualizarCategoria
const actualizarProdcuto = async(req, res = response) => {

    const {id} = req.params;
    // extrae estado y usuario para que no pueda ser modificado o alterado
    const {estado, usuario, ...data} = req.body;

    if(data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Prodcuto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto);
}

// borrarCategoria - estado:false
const borrarProducto = async(req, res = response ) => {

    const {id} = req.params;
    const productoBorrada = await Prodcuto.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.json(productoBorrada);

}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProdcuto,
    borrarProducto
}