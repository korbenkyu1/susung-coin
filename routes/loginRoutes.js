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
    res.status(200).render("login");
});
router.post("/", async (req, res, next) => {
    var payload = req.body;
    
    if(req.body.userID && req.body.password){
        var user = await User.findOne({userID: req.body.userID})
        .catch((err)=>{
            console.log(err);
            payload.errorMessage = "오류 발생.";
            res.status(200).render("login", payload);
        });
        if(user != null){
            var result = await bcrypt.compare(req.body.password, user.password);
            if(result === true){
                req.session.user = user;
                return res.redirect("/");
            }
        }
        payload.errorMessage = "아이디 또는 비밀번호가 일치하지 않습니다.";
        return res.status(200).render("login", payload);
    }
    payload.errorMessage = "모든 입력란을 작성하세요";
    res.status(200).render("login", payload);
});
module.exports = router;