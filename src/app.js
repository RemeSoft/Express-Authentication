require('dotenv').config()
require("./db/conn")
const RegisterModel = require("./models/register")
const auth = require("./middleware/auth")
const bcryptjs = require("bcryptjs")
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require("cookie-parser");


const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(express.static(publicPath));
app.use(cookieParser());
app.set("view engine", "hbs");
app.set("views",templatePath);
hbs.registerPartials(partialsPath)


app.get('/', (req, res) => {
    res.status(200).render('index')
});

app.get('/register', (req, res) => {
    res.status(200).render('register')
});


app.post('/register', async (req, res) => {
    try{
        const password = req.body.password;
        const Cpassword = req.body.Cpassword;
        if(password === Cpassword){
            const registerUser = new RegisterModel(req.body);
            const token = await registerUser.generateToken();
            console.log(token);
            const saveUser = await registerUser.save();
            if(saveUser){
                res.status(302);
                res.cookie('token', token, { 
                    expires: new Date(Date.now()+60000),
                    httpOnly: true
                 });
                return res.redirect("/");
            }
        }else{
            res.send("Password are not matching.")
        }
    }catch(err){
        res.status(400).send(err.message || err)
    }
});

app.get('/login', (req, res) => {
    res.render('login')
});

app.post('/login',async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try{
        const user = await RegisterModel.findOne({ email: email});
        if(user){
            console.log(user.password);
            const isMatch = await bcryptjs.compare(password, user.password);
            console.log(isMatch);
            const token = await user.generateToken();
            if(isMatch){
                res.cookie('token', token, { 
                    expires: new Date(Date.now()+60000),
                    httpOnly: true,
                    // secure: true - it's works only https
                 });
                res.redirect("/");
            }else{
                res.send("invalid login details");
            }
        }
    }catch(err){
        res.send("invalid login details");
    }
});

app.get('/admin', auth ,(req,res)=>{
    res.render('admin');
})

app.get('/logout', auth ,(req,res)=>{
    res.clearCookie('token');
    res.status(302).redirect('/');
})

app.listen(PORT, () => {
    console.log("Listening on port" + PORT);
});