const JWT=require('jsonwebtoken');

const jwtAuth =(req,res,next) =>{
    const token = (req.cookies&&req.cookies.token)||null;

    if(!token){
        return res.status(400).json({
            success:false,
            message:'Not Authorized'
        });
    }
    try {
        const payload = JWT.verify(token,process.env.SECRET);
        // it will return the payload from the token

        req.body = {
            id:payload.id,
            email:payload.email
        };
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }

    next();
}

module.exports=jwtAuth;