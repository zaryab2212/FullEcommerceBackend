const mongoose = require("mongoose")

exports.connection = async () =>{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DateBase is ready to use");
  }
