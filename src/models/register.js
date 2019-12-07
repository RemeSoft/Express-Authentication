const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required: true,
        lowercase: true,
        minLength: 3,
        maxLength: 20,
        trim: true,
    },
    email:{        
        type: 'string',
        required: true,
        trim: true,
        unique: true,
    },
    phone:{
        type: Number,
        required: true,
        trim: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
});

// generating tokens
registerSchema.methods.generateToken = async function (){
    try{
        const genToken = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        this.tokens.concat({token: genToken});
        return genToken;
    }catch(err){ 
        console.log("The error part", err);
    }
}

// hashing passwords
registerSchema.pre("save", async function(next){
    this.password = await bcryptjs.hash(this.password, 10);
    this.Cpassword = undefined;
    next();
})


const RegisterModel = mongoose.model('User', registerSchema);
module.exports = RegisterModel;