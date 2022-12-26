const jwt = require('jsonwebtoken');

const generateToken = (uid, name, email) => {

    const payload = { uid, name, email };

    return new Promise((resolve, reject) => {

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');

            } else {
                resolve(token);
            }
        })


    });

}

module.exports = {
    generateToken
}