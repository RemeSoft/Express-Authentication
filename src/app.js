require("./db/conn")
const RegisterModel = require("./models/register")
const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(express.static(publicPath));
app.set("view engine", "hbs");
app.set("views",templatePath);
hbs.registerPartials(partialsPath)


app.get('/', (req, res) => {
    res.render('index')
});
app.get('/register', (req, res) => {
    res.render('register')
});
app.post('/register', async (req, res) => {
    try{
        const password = req.body.password;
        const Cpassword = req.body.Cpassword;
        if(password === Cpassword){
            const registerUser = new RegisterModel(req.body);
            const saveUser = await registerUser.save();
            if(saveUser){
                console.log(saveUser);
                res.status(201).redirect("/")
            }
        }else{
            res.send("Password are not matching.")
        }

    }catch(err){
        res.status(400).send(err)
    }
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login')
});

app.post('/login',async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        const user = await RegisterModel.findOne({ email: email});
        if(user.password === password){
            res.redirect("/");
        }else{
            res.send("invalid login details");
        }
    }catch(err){
        res.send("invalid login details");
    }

});

app.listen(PORT, () => {
    console.log("Listening on port" + PORT);
});