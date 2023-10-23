const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser')
const bcrypt = require("bcrypt")
const User = require('../schemas/UserSchema')

app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }))
 
router.get("/", (req, res, next) => {
    res.status(200).render("register");    
});

router.post("/", async (req, res, next) => {
    const userID = req.body.userID.trim();
    const password = req.body.password;
    var payload = req.body;

    if(userID && password){
        var user = await User.findOne({userID: userID})
        .catch((err)=>{
            console.log(err);
            payload.errorMessage = "Something went wrong.";
            res.status(200).render("register", payload);
        })
        if(user == null){
            var data = req.body;
            data.password = await bcrypt.hash(password, 1);
            User.create(data)
            .then((user) => {
                req.session.user = user;
                return res.redirect("/");
            })
        }
        else{
            payload.errorMessage = "이미 가입된 학번입니다."; 
            return res.status(200).render("register", payload);
        }
    }
    else{
        payload.errorMessage = "오류가 발생했습니다.";
        res.status(200).render("register", payload);
    }    
});
module.exports = router;
