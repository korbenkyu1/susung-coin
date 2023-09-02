const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser')
const middleware = require('../../middleware');
const User = require('../../schemas/UserSchema')
const Log = require('../../schemas/LogSchema')

app.use(bodyParser.urlencoded({ extended: false }))
 
router.get("/", (req, res, next) => {
    if(!req.session.user){
        return res.redirect('/login');
    }
    const userID = req.session.user.userID;
    Log.find({
        $or: [
            {from: userID},
            {to: userID}
        ]
    })
    .sort({'createdAt': 1})
    .then(results => res.status(200).send(results));
});
module.exports = router;