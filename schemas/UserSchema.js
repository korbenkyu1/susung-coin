const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    userID:{ type: String, required: true, trim: true },
    password:{ type: String },
    money: { type:Number, default: 1000},
    isBooth: {type:Boolean, default: false},
    isAdmin: {type:Boolean, default: false}
});
var User = mongoose.model('User', UserSchema);
module.exports = User;