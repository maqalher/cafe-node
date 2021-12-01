const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usariosGet = async (req = request, res = response) => {

    // const query = req.query;
    // const { q, nombre = "No name", apikey } = req.query;
    const { limite = 5, desde = 0 } = req.query;
    // const usuarios = await Usuario.find()

    // const usuarios = await Usuario.find({ estado: true})
    // .skip(Number(desde))
    // .limit(Number(limite));

    // const total = await Usuario.countDocuments({ estado: true});

    // res.status(200).json({
    //     total,
    //     usuarios
    // });

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({ estado: true })
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.status(200).json({
        total,
        usuarios
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // Validar password contra BD
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Verificar si el correo existe
    // const existeEmail = await Usuario.findOne({correo});
    // if(existeEmail) {
    //     return res.status(400).json({
    //         msg: 'Ese correo ya esta registrado'
    //     })
    // }

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;

    // Eliminar fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id);

    // Eliminar cambiando estado
    const usuario = await Usuario.findByIdAndUpdate( id, {estado: false })

    res.json(usuario);
}

module.exports = {
    usariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}