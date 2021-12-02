const {request, response} = require('express');
const req = require('express/lib/request');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next) => {
    
    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        // console.log(payload)

        // leer el usuario que corresponde al uid
        const usuario = req.usuario = await Usuario.findById(uid);

        // Verificar que exista en la BD
        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en BD'
            })
        }

        // Verificar si el uid tiene estado true
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            })
        }


        // req.uid = uid;
        req.usuario = usuario;

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
        
    }

}

module.exports = {
    validarJWT
}