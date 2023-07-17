const userModel= require('../model/dbschema');
const emailValidator = require("email-validator");


exports.signUp  = async(req,res,next)=>{
    const {name,email,password,confirmPassword} = req.body;
    console.log(req.body);

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

    return 
    res.status(200).json({
        success:true,
        data:result
    });
    }
    catch(err){
        /// if dupliacte found
        if(err.code = 11000){
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

exports.signIn = async (req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(404).json({
            success:false,
            message:"Every Field is mandatory"
        })
    }
    const user = await userModel.find({
        email
    }).
    select('+password');

    if(!user || !user.password){
        return res.status(404).json({
            success:false,
            message:"Invalid Credentials"
        })
    }
}
