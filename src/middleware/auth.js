const jwt = require('jsonwebtoken');
const RegisterModel = require("../models/register");

const auth = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        const user = await RegisterModel.findOne({_id:verify._id});
        req.token = token;
        req.user = user;
        next();

    }catch(err){
        res.status(401);
        res.redirect("/login")
    }
}

module.exports = auth;