
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, require: true, unique: true },
  password: { type: Buffer, require: true },
  role: { type: String, require: true, default: "user" },
  addresses: { type:  [mongoose.Schema.Types.Mixed] },
  name: { type: String},
  orders: { type: [mongoose.Schema.Types.Mixed]},
  salt: {type:Buffer}
});

exports.User = mongoose.model("User", userSchema);
