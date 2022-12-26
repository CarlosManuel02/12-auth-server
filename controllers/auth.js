// imports
const { response, request } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../helpers/jwt');
const e = require('express');


const createUser = async (req = request, res = response) => {

    const { name, email, password } = req.body;


    try {
        // validar si el email existe
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Este email ya está registrado'
            });
        }

        // crear usuario con el modelo
        usuario = new Usuario(req.body);

        // hashear la contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // generar el JWT
        const token = await generateToken(usuario.id, usuario.name, usuario.email)

        // crear usuario en DB
        await usuario.save();

        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            email: usuario.email,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }


}

const loginUser = async (req = request, res = response) => {

    const { email, password } = req.body;

    try {

        const dbUser = await Usuario.findOne({ email });
        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // confirmar la contraseña
        const validPassword = bcrypt.compareSync(password, dbUser.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // generar el JWT( token )
        const token = await generateToken(dbUser.id, dbUser.name, dbUser.email);


        // Generar respuesta exitosa
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        });



    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const renewToken = async (req = request, res = response) => {

    const { uid, name, email } = req;
    console.log(email);

    // generar un nuevo JWT y retornarlo en esta petición
    const token = await generateToken(uid, name, email);

    return res.json({
        ok: true,
        uid,
        name,
        email,
        token

    });

}

// const renewsToken = async (req = request, res = response) => {

//     const { uid } = req;
//     const dbUser = await Usuario.findById(uid);


//     // generar un nuevo JWT y retornarlo en esta petición
//     const token = await generateToken(uid, dbUser.name);

//     return res.json({
//         ok: true,
//         uid,
//         name: dbUser.name,
//         email: dbUser.email,
//         token

//     });

// }


const deleteUser = async (req = request, res = response) => {
    const { uid } = req.body;
    console.log(uid);

    try {
        const dbUser = await Usuario.findById(uid);
        if (!dbUser) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);
        if (Usuario.findByIdAndDelete(uid) === null) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        } else {
            return res.status(200).json({
                ok: true,
                msg: 'Usuario eliminado'
            });

        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

module.exports = {
    createUser,
    loginUser,
    renewToken,
    deleteUser
}