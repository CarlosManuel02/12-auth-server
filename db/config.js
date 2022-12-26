const mongoose = require("mongoose");
const { logError } = require("../helpers/logeer");



const dbConection = async () => {

    try {

        mongoose.set('strictQuery', true);

        console.log("Conectando a la base de datos...");
        await mongoose.connect(process.env.DB_MONGODB);
        console.log("DB Online");

    } catch (error) {
        console.log(error);
        logError(error);
        throw new Error("Error a la hora de iniciar la BD ver logs");
    }

}

module.exports = {
    dbConection
}