// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

// optimizando llamado de middlewares

const validaCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validaArchivo = require('../middlewares/validar-archivo');

module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
    ...validaArchivo,
}