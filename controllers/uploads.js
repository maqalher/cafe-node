const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);
// const { v4: uuidv4 } = require('uuid');
const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Prodcuto } = require('../models');

const cargarArchivo = async (req, res = response) => {

    // console.log(req.files);
    // {
    //     archivo: {
    //         name: 'logo-footer.png',
    //             data: <Buffer >,
    //                 size: 6624,
    //                 encoding: '7bit',
    //                 tempFilePath: '\\tmp\\tmp-1-1639010959861',
    //                 truncated: false,
    //                 mimetype: 'image/png',
    //                 md5: '9b444e32450eded3a5d97f6d401aa490',
    //                 mv: [Function: mv]
    //     }
    //   }

    // // valida si no hay archivo o alguna propiedad de file 
    // if (!req.files || Object.keys(req.files).length === 0) {
    //     res.status(400).json('No hay archivos que subir');
    //     return;
    // }

    // // si no el file de archivo
    // if (!req.files.archivo) {
    //     res.status(400).json('No hay archivos que subir');
    //     return;
    // }


    // // sampleFile = req.files.archivo;
    // const {archivo} = req.files;

    // // Validar extension
    // const nombreCortado = archivo.name.split('.');
    // const extension = nombreCortado[ nombreCortado.length - 1 ];
    // const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    // if(!extensionesValidas.includes(extension)) {
    //     return res.status(400).json({
    //         msg: `La extension ${extension} no es permitida, ${extensionesValidas}`
    //     });
    // }

    // // Nombre aleatroio
    // const nombreTemp = uuidv4() + '.' + extension;

    // // Ruta en la que se va a subir el archivo
    // const uploadPath = path.join( __dirname, '../uploads/' , nombreTemp);

    // archivo.mv(uploadPath, (err) => {
    //     if (err) {
    //         return res.status(500).json({err});
    //     }

    //     res.json({ msg: 'El archivo se subio a ' + uploadPath});
    // });

    try {
        // const nombre = await subirArchivo(req.files, ['png'], 'textos');
        // const nombre = await subirArchivo(req.files, undefined, 'textosss');
        // const nombre = await subirArchivo(req.files);
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        res.json({
            nombre
        })
    } catch (msg) {
        res.status(400).json({ msg })
    }
}

const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Prodcuto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un prodcuto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido esto' })
            break;
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        // si existe el archivo
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo)

}

const actualizarImagenCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Prodcuto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un prodcuto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido esto' })
            break;
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        // console.log(nombre)
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    
    modelo.img = secure_url;
    
    await modelo.save();
    
    res.json(modelo)

    // res.json(resp)
    // Respeusta cloudinary
    // const resp = await cloudinary.uploader.upload(tempFilePath);
    // {
    //     "asset_id": "fc0e08b9982141c49d3e8e0cdacab7a0",
    //     "public_id": "ijigsub3dxcolgzhg3qz",
    //     "version": 1639030836,
    //     "version_id": "27da7a1f138cc488cb5f8623289c4afe",
    //     "signature": "0f5cb51e5d37d46c0e2f52b18fd44fd29015477e",
    //     "width": 182,
    //     "height": 150,
    //     "format": "jpg",
    //     "resource_type": "image",
    //     "created_at": "2021-12-09T06:20:36Z",
    //     "tags": [],
    //     "bytes": 10936,
    //     "type": "upload",
    //     "etag": "631634c446f55299056310b776f37c1f",
    //     "placeholder": false,
    //     "url": "http://res.cloudinary.com/luchadev/image/upload/v1639030836/ijigsub3dxcolgzhg3qz.jpg",
    //     "secure_url": "https://res.cloudinary.com/luchadev/image/upload/v1639030836/ijigsub3dxcolgzhg3qz.jpg",
    //     "original_filename": "tmp-1-1639030836979",
    //     "api_key": "887246799844538"
    // }

}

const mostrarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Prodcuto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un prodcuto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido esto' })
            break;
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        // si existe el archivo
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    // Mostrar placeholder
    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}