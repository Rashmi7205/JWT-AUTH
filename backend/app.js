const express = require("express");
const authRouter = require("./routers/authRouter");
const databaseConnect = require("./config/databaseconfig.js");
const cookieParser = require('cookie-parser');

const app = express();

databaseConnect();

app.use(cookieParser());/// parse the coookie to the json format
app.use(express.json());/// To accept the JSON payload form the request
app.use('/api/auth',authRouter);/// router configuration 

app.use('/',(req,res)=>{
    res.status(200).json({
        data:"JWT auth server"
    });
});

module.exports = app;