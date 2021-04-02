//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017", {useNewUrlParser: true});

const UserSchema = {
    name : String,
    email : String,
    phone : String,
    branch : String,
    dob : Date,
    password : String
};

const User = mongoose.model("User", UserSchema);

app.get("/signup", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.get("/login", function(req,res){
    res.sendFile(__dirname + "/login.html");
});

app.post("/signup", function(req,res){
    const v1 = req.body.name;
    const v2 = req.body.email;
    const v3 = req.body.phone;
    const v4 = req.body.branch;
    const v5 = req.body.dob;
    const v6 = req.body.password;
    console.log(req.body);

    // Email Check
    const fix = "@nitdelhi.ac.in";
    console.log(v2.length);
    console.log(v2.slice(9,24));
    if(v2.length === 24 && v2.slice(9,24) !== fix)
    {
        res.send("<h1> Failure 1 </h1>");
    }

    // PhoneNumber Check
    if(v3.length !== 10)
    {
        res.send("<h1> Failure 2 </h1>");   
    }

    
    let f = 1;
    for(let i=0;i<10;i++)
    {
        // console.log(v3[i] === '9');
        if(v3[i] !== '0' && v3[i] !== '1' && v3[i] !== '2' && v3[i] !== '3' && v3[i] !== '4' && v3[i] !== '5' && v3[i] !== '6' && v3[i] !== '7' && v3[i] !== '8' && v3[i] !== '9')
        {
            f = 0;
        }
    }
    console.log(f);
    if(f === 0)
    {
        res.send("<h1> Failure 3 </h1>");
    }
    
    // Branch Check
    if(v4.length > 1)
    {
        res.send("<h1> Failure 4 </h1>");
    }
    if(v4[0] !== '1' && v4[0] !== '2' && v4[0] !== '3')
    {
        res.send("<h1> Failure 5 </h1>");
    }

    // Check for the Date of Birth.

    const user = new User({
        name : v1,
        email : v2,
        phone : v3,
        branch : v4,
        dob : v5,
        password : v6
    });
    v2 === User.findOne({email : v2}, function(err, foundUser){
        if(err)
        {
            console.log("Error");
        }
        else
        {
            // TODO : need to tell user that Email Already Exists.
            if(foundUser !== null)
            {
            res.send("<h1> Failure 6 </h1>");
            }
            else
            {
            User.insertMany(user);
            user.save();
            }
        }
    });
    res.sendFile(__dirname + "/login.html");
});

app.post("/login", function(req,res){
    console.log(req.body);
    const em = req.body.email;
    const pass = req.body.password;
    em === User.findOne({email : em}, function(err, resp){
        if(err)
        {
            console.log("err");
        }
        // console.log(resp.password);
        // console.log(pass);
        if(resp !== null)
        {
            if(resp.password === pass)
            {
            // Dashboard
            res.send("<h1>Success 1 </h1>");
            }
            else
            { 
            // Redirect to LoginPage again.
            res.send("<h1>Failure 8 </h1>");
            }
        }
        else
        {
            // Redirect to LoginPage again.
            res.send("<h1>Failure 9 </h1>");
        }
    });
    // console.log("123456");
});

app.get("/Reset_Password", function(req,res){
    res.sendFile(__dirname + "/Reset_Password.html");
})

app.post("/Reset_Password", function(req,res){
    console.log(req.body.email);
    var f = 0;
    User.findOne({email : req.body.email}, function(err,resp){
        if(!err)
        {
            console.log(resp);
            if(resp === null)
            {
                res.send("<h1> Failure 10 </h1>");
            }
            if(resp.password === req.body.oldpass)
            {
                User.updateOne({email : req.body.email}, {$set :{"password" : req.body.newpass}}, function(err,respond){
                    if (err) throw err;
                    console.log("1 document updated");
                    res.redirect("/login")
                });
                f = 1;
                // resp.password = req.body.newpass;
            }
            else
            {
                res.send("<h1> Failure 11 </h1>");
                f = 1;
            }
        }
        else
        {
            console.log("err");
            f = 1;
        }
    });
});

// let port = process.env.PORT;
// if (port == null || port == "") {
port = 3001;
// }
app.listen(port, function() {
    console.log("Server started on port 3000");
});
