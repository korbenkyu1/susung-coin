const mongoose = require("mongoose");

class Database{
    constructor() {
        this.connect();
    }
    connect(){
        mongoose.connect("mongodb+srv://admin:8VY73ZPtKA3KUCEI@susungcoincluster.kvelvf5.mongodb.net/?retryWrites=true&w=majority")
        .then(()=>{
            console.log("successfully connected to mongodb");
        })
        .catch((err)=>{
            console.log("error while connecting to mongodb: " + err);
        })
    }
}

module.exports = new Database();