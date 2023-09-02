const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const LogSchema = new Schema({
    from: {type:String, trimg: true},
    to: {type:String, trim: true},
    money: { type:Number, default: 0}
    
}, {timestamps: true});
var Log = mongoose.model('Log', LogSchema);
module.exports = Log;