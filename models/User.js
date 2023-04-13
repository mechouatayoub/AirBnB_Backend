const mongoose = require("mongoose");
const connection = require("../dbconnection.js");

let schema = new mongoose.Schema({
  email: { type: mongoose.Schema.Types.String },
  username: { type: mongoose.Schema.Types.String },
  description: { type: mongoose.Schema.Types.String },
  token: { type: mongoose.Schema.Types.String },
  hash: { type: mongoose.Schema.Types.String },
  salt: { type: mongoose.Schema.Types.String },
});

let model = connection.model("User", schema);

module.exports = model;
