const express = require("express");
const cookieParser = require('cookie-parser');
const {signUp,signIn,getUser,logout} = require("../controller/authController");

const jwtAuth = require('../middleware/jwtauth');

const authRouter = express.Router();


authRouter.post('/signup',signUp);
authRouter.post('/signin',signIn);
authRouter.get('/getuser',jwtAuth,getUser);
authRouter.get('/logout',jwtAuth,logout);

module.exports = authRouter

