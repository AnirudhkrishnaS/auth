//jshint esversion:6
require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;

const app = express()
// console.log(process.env.SECRET);
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB")
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})



const USER = new mongoose.model("User", userSchema)

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/register", (req, res) => {
    res.render("register")
})


app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new USER({
            email: req.body.username,
            password:hash
        })
    
        newUser.save((err) => {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets")
            }
        })
        
    });

})


app.post("/login", (req, res) => {
    const username = req.body.username;
    const password =req.body.password
    // console.log(username);


    USER.findOne({ email: username }, (err, foundUser) => {
        // console.log(foundUser);
        if (err) {
            console.log(err);
        } else {
            // console.log(foundUser);
            if (foundUser) {
                bcrypt.compare(password,foundUser.password, function(err, result) {
                    if(result === true){
                        res.render("secrets")

                    }
                   
                });
              
         
                
            }
        }
    })
})





app.listen(3000, () => {
    console.log('server started');
})
