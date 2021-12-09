const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;

        // Validar extension
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida - ${extensionesValidas}`)
        }

        // Nombre aleatroio
        const nombreTemp = uuidv4() + '.' + extension;

        // Ruta en la que se va a subir el archivo
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            // resolve(uploadPath);
            resolve(nombreTemp);
        });


    });


}

module.exports = {
    subirArchivo
}