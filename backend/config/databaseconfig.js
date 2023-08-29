const mongoose = require("mongoose")

const MONGO_URL = process.env.MONGODB_URL;


const databaseConnect = ()=>{

    mongoose.connect(process.env.MONGODB_URL)
    .then((conn)=>{
        console.log(`Db connected succesfuly ${conn.connection.host}`);
    })
    .catch((err)=>{
        console.log("ERROR! ",err.message);
    })
}

module.exports = databaseConnect;