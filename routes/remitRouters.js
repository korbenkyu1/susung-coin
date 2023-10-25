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
    const fromUser = await User.findOne({userID: req.session.user.userID});
    const toUser = await User.findOne({userID: req.body.to});
    const moneySent = parseInt(req.body.money);

    // 관리자가 아니라면
    if(fromUser.isAdmin === false){
        var payload = {
            pageTitle: "",
            userLoggedIn: req.session.user,
        }
        // 송금 대상이 있는지
        if(toUser == null){
            payload.pageTitle = "송금 실패";
            payload.errorMessage = "송금 대상을 찾을 수 없습니다.";
            return res.status(200).render("remit", payload);
        }
        // 송금 가능한 대상인지
        if(fromUser.isBooth === toUser.isBooth){
            payload.pageTitle = "송금 실패";
            payload.errorMessage = "올바르지 않은 송금 대상입니다.";
            return res.status(200).render("remit", payload);
        }
        // 송금 금액이 올바른지
        if(moneySent <= 0 || moneySent > 60000){
            payload.pageTitle = "송금 실패";
            payload.errorMessage = "올바르지 않은 송금 금액입니다.";
            return res.status(200).render("remit", payload);
        }
        // 송금 금액이 충분한지
        if(fromUser.money < moneySent){
            payload.pageTitle = "송금 실패";
            payload.errorMessage = "잔액이 부족합니다.";
            return res.status(200).render("remit", payload);
        }
        // 중복 송금 방지
        const log = await Log.findOne({
            $and: [
                {from: fromUser.userID},
                {to: toUser.userID}
            ]
        })
        if(!toUser.isAdmin && log){
            payload.pageTitle = "송금 실패";
            payload.errorMessage = "이미 송금한 송금 대상입니다.";
            return res.status(200).render("remit", payload);
        }
    }
    // 관리자 예외
    else if(
        [
            "학생회팝콘",
            "학생회소시지",
            "학생회아이스티",
            "학생회티켓응모",
            "학생회상품응모",
            "학생회상품응모두번째",
            "학생회상품응모세번째"
        ].includes(fromUser.userID)
    ){
        // 가져올 금액이 충분한지
        if(toUser.money + moneySent < 0){
            payload.pageTitle = "송금 실패";
            payload.errorMessage = "잔액이 부족합니다.";
            return res.status(200).render("remit", payload);
        }

        // 중복 구입 방지
        const log = await Log.findOne({
            $and: [
                {from: fromUser.userID},
                {to: toUser.userID}
            ]
        })
        if(!toUser.isAdmin && log){
            payload.pageTitle = "송금 실패";
            payload.errorMessage = "이미 송금한 송금 대상입니다.";
            return res.status(200).render("remit", payload);
        }
    }
    await User.updateOne({userID: toUser.userID}, {'$inc': {money: +moneySent}});
    req.session.user = await User.findOneAndUpdate({userID: fromUser.userID}, {'$inc': {money: -moneySent}}, {returnOriginal: false});
    var data = {
        from: fromUser.userID,
        to: toUser.userID,
        money: moneySent
    }
    Log.create(data);
    res.redirect("/");
});
module.exports = router; 
