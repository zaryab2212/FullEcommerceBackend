const mongoose = require("mongoose")

exports.connection = async () =>{
    await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
    console.log("DateBase is ready to use");
  }
