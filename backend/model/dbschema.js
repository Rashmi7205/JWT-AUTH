const mongoose = require('mongoose');

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

const userModel = mongoose.model('user',userSchema);
module.exports = userModel;

