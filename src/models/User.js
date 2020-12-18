const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: String,
    age: String,
    scholarship: String,
    keyImage: String,
    urlImage: String,
    phone: String,
    email: String,
    password: String,
    type: String,
    sessiontype: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("user", userSchema);
