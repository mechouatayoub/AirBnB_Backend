const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const User = require("../models/User.js");

// Check whether the email is used or not
async function findEmail(req, res, next) {
  try {
    let email = req.fields.email;
    let user = await User.find({ email: email });
    console.log(user, email, !user);
    if (user.length == 0 && email) {
      next();
    } else {
      console.log(user);
      res.status(400).json("Utilisateur existant1");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json("Nous rencontrons un problème de connexion");
  }
}

//Check whether the username is used or not
async function findUserName(req, res, next) {
  try {
    let username = req.fields.username;
    let user = await User.find({ username: username });
    if (user.length == 0 && username) {
      next();
    } else {
      console.log(user);
      res.status(400).json("Utilisateur existant2");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json("Nous rencontrons un problème de connexion");
  }
}

//Check whether the passwords are dissimilar
async function checkPasswords(req, res, next) {
  try {
    let password1 = req.fields.password1;
    let password2 = req.fields.password2;
    if (password1 === password2 && password1) {
      const salt = uid2(16);
      const hash = SHA256(password1 + salt).toString(encBase64);
      const token = uid2(16);
      req.salt = salt;
      req.token = token;
      req.hash = hash;
      next();
    } else {
      console.log(password1, password2);
      res.status(400).json("Mots de passes incohérents");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json("Nous rencontrons un problème de connexion");
  }
}

//Create the account if it does not exist and mandatory data are coherent and available
router.post(
  "/signup",
  findEmail,
  findUserName,
  checkPasswords,
  async (req, res) => {
    try {
      let newUser = new User({
        email: req.fields.email,
        username: req.fields.username,
        description: req.fields.description,
        token: req.token,
        hash: req.hash,
        salt: req.salt,
      });
      await newUser.save();
      res.status(200).json(newUser);
    } catch (error) {
      console.log(error);
      res.status(400).json("Nous rencontrons un problème de connexion");
    }
  }
);

router.get("/signin", async (req, res) => {
  let emailInbound = req.fields.email;
  let passwordInbound = req.fields.password;

  try {
    let user = await User.findOne({ email: emailInbound });
    if (user) {
      console.log(user);
      let hash = SHA256(passwordInbound + user.salt).toString(encBase64);
      if (hash === user.hash) {
        res.status(200).json({ user_id: user._id, token: user.token });
      } else {
        res.status(400).json({
          message: "Mot de passe erroné",
        });
      }
    } else {
      res.status(400).json({
        message: "Utilisateur non enregistré. Veuillez créer un compte",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json("Nous rencontrons un problème de connexion");
  }
});

module.exports = router;
