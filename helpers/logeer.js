const fs = require('fs')


const logError = (error) => {
    fs.watchFile('./log/log.txt', error, (err) => {
        if (err) throw err;
    })
}



module.exports = {
    logError
}