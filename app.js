const express = require('express');
const path = require('path');
var mongodb= require('mongodb');
const bodyParser = require('body-parser');
var MongoClient=mongodb.MongoClient
var url='mongodb://localhost:27017/'
const { kStringMaxLength } = require('buffer');
const app = express();

const ejs = require('ejs');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(8080, ()=>{
    console.log('App listening on port 8080');
    console.log('Check localhost:8080')
});


app.get('/', (req,res) => { 
    res.render('index');
});
app.get('/checkout', (req,res) => { 
    res.render('checkout');
});
app.get('/signup', (req,res) => { 
    res.render('register');
});

MongoClient.connect(url,function(error, databases) {
    if(error){
        throw error
    }
var dbobject=databases.db('StagheadCoffee')
console.log("databases is up and runing")
databases.close()
})

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/StagheadCoffee');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})


const LoginSchema = {
    fname: String,
    lname: String,
    email: String,
    password: String
}

const signup = mongoose.model('signups', LoginSchema);

app.get('/accounts', (req, res) => {
    signup.find({}, function(err, LoginInfo) {
        res.render('accounts', {
            loginList: LoginInfo
        })
    })
});

app.get("/search", (req, res) => {
    var value = req.query.search;
    signup.find({item:value}, function(err, LoginInfo) {
        res.render('index', {
            loginList: LoginInfo
        })
    })
})

app.get("/editform", async(req,res) => {
    var id = req.query.id;
    if(id != undefined) {
        const result = await signup.findById(id);
        //console.log(result);
        res.render('Edit', {signup: result});
    } 
    else {
        res.render('Edit', {signup: ""})
    }
});

app.post("/edit", (req,res) => {
    res.redirect(`/editform/?id=${req.body.id}`);
});

app.post("/editform", (req,res) => {
    signup.findByIdAndUpdate(req.body._id, req.body, (err) => {
        if(err){
            throw err
        }
    })
    res.redirect("/accounts");
});

app.post("/delete", (req, res) => {
    console.log(req.body.id);
    signup.findByIdAndRemove(req.body.id, (err, docs) => {
        if(err){
            throw err
        }
        
    })
    res.redirect("/accounts");
});

app.post('/formsub',function (req,res){
    var fname= req.body.fname;
    var lname= req.body.lname;
    var email= req.body.email;
    var password = req.body.password;


    var data = {
        "fname": fname,
        "lname": lname,
        "email": email,
        "password":password
    }

    db.collection('signups').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
              
    });
    res.redirect("/");
});

