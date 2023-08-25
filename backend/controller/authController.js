const userModel= require('../model/dbschema');
const emailValidator = require("email-validator");
const bcrypt=require('bcrypt');


exports.signUp  = async(req,res,next)=>{
    const {name,email,password,confirmPassword} = req.body;

    if(!name|| !email || !password || !confirmPassword){
        return  res.status(401).json({
            success:false,
            message:'Every Field is required'
        });
    }

    const validateEmail = emailValidator.validate(email);
    if(!validateEmail){
        return  res.status(401).json({
            success:false,
            message:'Email is invalid'
        });
    }

    if(password!==confirmPassword){
        return  res.status(401).json({
            success:false,
            message:'Password incorrect confirm password does not match'
        });
    }

    try{
    ///  Getting the user info
    const userInfo = userModel(req.body);
    /// Saving the data in db
    const result =  await userInfo.save();

    return res.status(200).json({
        success:true,
        data:result
    });
    }
    catch(err){
        /// if dupliacte found
        if(err.code == 11000){
            return res.status(401).json({
                success:false,
                message:`Already email exist`
            });
        }
        return res.status(401).json({
            success:false,
            message:`error ${err.message}`
        });
    }
}

///signin 

exports.signIn = async (req,res,next)=>{
    const {email,password} = req.body;
    console.log(req.body)
    try {
        if(!email || !password){
            return res.status(404).json({
                success:false,
                message:"Every Field is mandatory"
            })
        }
        const user = await userModel.findOne({
            email
        }).
        select('+password');
    
        if(!user ||!(await bcrypt.compare(password,user.password))){
            return res.status(404).json({
                success:false,
                message:"Invalid Credentials"
            })
        }
        /// Generaring Token
        const token = user.jwtToken();
        /// Making password undefined
        user.password=undefined;
    
        /// Writting the Cookie options
        const cookieOptions = {
            maxAge:24*60*60*1000, /// Time limit of expiry of cookie
            httpOnly:true  /// cannot access from the client Side js
        };
        /// Set the Cookie
        res.cookie("token",token,cookieOptions); /// (cookiename,cookie,options)
        return res.status(200).json({
            success:true,
            data:user
        })
    } catch (error) {
        return res.status(404).json({
            success:false,
            message:error.message
        })
    }
    


}


/// get user fetails
exports.getUser = async (req,res,next)=>{
    /// gettin the user id from user
    const userId = req.body.id;

    ///Retriving data from the DB
    try {
        const userData= await userModel.findById(userId);
        console.log(userData);
        return res.status(200).json({
            success:true,
            message:"Data successfully Fetced",
            data:userData
        });
    } catch (error) {
        return res.status(404).json({
            success:false,
            message:"Error "+error.message
        })
    }
}

/// logout user
exports.logout= (req,res)=>{
    try {
        /// set the cookies option
        const cookieOptions = {
            expires:new Date(),
            httpOnly:true
        };

        /// set cookies to null  or delete the cookies

        res.cookie("token",null,cookieOptions);

        return res.status(200).json({
            success:true,
            message:"Logged out successful"
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}