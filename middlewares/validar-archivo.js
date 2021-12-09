const { response } = require("express");


const validarArchivoSubir = (req, res = response, next) => {
    // valida si no hay archivo o alguna propiedad de file 
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ 
            msg: 'No hay archivos que subir - validarArchivoSubir'
        });
    }

    next();
}

module.exports = {
    validarArchivoSubir
}