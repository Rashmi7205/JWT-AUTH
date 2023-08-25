const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const bcrypt=require('bcrypt')

const {Schema} = mongoose;

const userSchema = new Schema({
    name:{
        type:String,
        require:[true,"User name is  Required"],
        minLength:[5,"name must be at least 5 char"],
        maxLength:[50,"name must be less than 50 char"],
        trim:true
    },
    email:{
        type:String,
        require:[true,"User name is  Required"],
        unique:true,
        lowercase:true,
        unique:[true,'already Exist']
    },
    password:{
        type:String,
        select:false
    },
    forgotPasswordToken:{
        type:String
    },
    forPasswordExpiryDate:{
        type:Date
    }
},{
    timestamps:true
});

/// middleware in the schema
userSchema.pre("save",async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    return next();
})


/// methods for the schema
userSchema.methods = {
    jwtToken() {
        return JWT.sign(
            {id:this.id, email: this.email}, /// data
            ///Secret key
            process.env.SECRET,
            ///Expiry Time
            {expiresIn:'24h'}
        )
    }
}

const userModel = mongoose.model('user',userSchema);
module.exports = userModel;

