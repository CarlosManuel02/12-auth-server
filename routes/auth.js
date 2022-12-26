const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken, deleteUser } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');

const router = Router();


// Rutas

// crear nuevo usuario
router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña no cumple con las normas de seguridad')
        .isLength({ min: 6 }),
    validarCampos
], createUser);


// login usuario 
router.post('/', [
    // validarCampos (middleware)
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña no cumple con las normas de seguridad')
        .isLength({ min: 6 }),
    validarCampos
], loginUser);

// validar y revalidar token
router.get('/renew', validateJWT, renewToken);

// borrar usuario   
router.delete('/delete', deleteUser);



module.exports = router;