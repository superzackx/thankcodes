const express       = require("express")
const app           = express();
const bodyParser    = require("body-parser")
const mongoose      = require("mongoose")
const Gratitude     = require('./models/gratitude')
const path          = require('path')
//MONGODB SETUP
mongoose.connect(process.env.url, {useUnifiedTopology: true, useNewUrlParser: true})

//BODYPARSER AND EJS SETUP
app.set('view engine' , 'ejs')
app.use(bodyParser.urlencoded({extended: true}));

//AUTH0 SETUP

const { auth, requiresAuth } = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'https://thank.codes/',
    clientID: 'qRpqX1qrzhpx4405jcKDi3rvNZdi8NOj',
    issuerBaseURL: 'https://dev-oetp0p0h.us.auth0.com'
};

app.use(auth(config));

//GET ROUTES

app.get("/" , (req , res) =>{
    res.render("welcome.ejs")
})

app.get("/home" , requiresAuth() , (req, res) =>{
    let user = req.oidc.user
    console.log(user)
    res.render("home" , {user: user})
})

app.get("/user/:user" , (req , res) =>{
    var author = req.params.user;
    res.render('userpage' , {author: author})
})

app.get("/api" , async (req , res) =>{
    const posts = await Gratitude.find({}).lean();
    res.json(posts)
})

app.get("/api/:id" , (req , res) =>{
    const id = req.params.id;
        Gratitude.findById(id, function (err, post) {
            if (err) {
                console.log(err)
            } else {
                console.log(post)
                res.json(post)
            }
        })
})
//POST ROUTES

app.post("/api/new" , async (req , res) =>{
    try {
        const post = new Gratitude({
            content: req.body.content,
            author: req.body.author
        })
        await post.save();
        console.log("Saved!")
        res.json(post)
    }
    catch (e){
        console.log(e)
        res.redirect("/")
    }
})

//LISTEN AND END

app.listen(process.env.PORT, ()=>{
    console.log("Server up on port")
})