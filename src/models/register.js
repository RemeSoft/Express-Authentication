const mongoose = require('mongoose');
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
    Cpassword:{
        type: String,
        required: true,
    },
});

const RegisterModel = mongoose.model('User', registerSchema);
module.exports = RegisterModel;