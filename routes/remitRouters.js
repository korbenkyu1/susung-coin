const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser')
const User = require('../schemas/UserSchema')
const Log = require('../schemas/LogSchema')

app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }))
 
router.get("/", (req, res, next) => {
    if(!req.session.user){
        return res.redirect('/login');
    }
    var payload = {
        pageTitle: "송금",
        userLoggedIn: req.session.user,
    }
    res.status(200).render("remit", payload);
});
router.post("/", async (req, res, next) => {
    var from = req.session.user.userID;
    var to = req.body.to;
    var moneySent = parseInt(req.body.money);
    var payload = {
        pageTitle: "송금",
        userLoggedIn: req.session.user,
    }
    const fromUser = await User.findOne({userID: from});

    // 관리자가 아니라면
    if(fromUser.isAdmin === false){
        toUser = await User.findOne({userID: to});
        // 송금 대상이 없는지
        if(toUser == null){
            payload.pageTitle = "송금 실패";
            payload.errorMessage = "송금 대상을 찾을 수 없습니다.";
            return res.status(200).render("remit", payload);
        }
        // 학생, 부스간 
        if(fromUser.isBooth === toUser.isBooth){
            payload.pageTitle = "송금 실패";
            payload.errorMessage = "잘못된 송금 대상입니다.";
            return res.status(200).render("remit", payload);
        }
        
        // 송금 금액이 충분한지
        if(moneySent > 0 && req.session.user.money < moneySent){
            payload.pageTitle = "송금 실패";
            payload.errorMessage = "잔액이 부족합니다.";
            return res.status(200).render("remit", payload);
        }
    }
        
    await User.updateOne({userID: to}, {'$inc': {money: +moneySent}});
    req.session.user = await User.findOneAndUpdate({userID: from}, {'$inc': {money: -moneySent}}, {returnOriginal: false});
    console.log(req.session.user)
    var data = {
        from: from,
        to: to,
        money: moneySent
    }
    console.dir(data);
    Log.create(data);
    
    payload.pageTitle = "송금 완료";
    res.status(200).render("remit", payload);
});
module.exports = router; 
