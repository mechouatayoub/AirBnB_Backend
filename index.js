const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const formidable = require("express-formidable");

const app = express();
const user = require("./routes/user.js");

app.use(formidable());

app.use("/user", user);

app.listen(process.env.PORT, (req, res) => {
  console.log("Server has started");
});
