const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

// SIGN UP
router.post("/signup", async (req, res) => {
  try {
    const emailExist = await User.findOne({ email: req.fields.email });
    if (emailExist) {
      res.status(409).json({ message: "User already exists" });
    } else if (req.fields.username === "") {
      res.status(400).json({ message: "Username is required" });
    } else {
      const password = req.fields.password;
      const userSalt = uid2(16);
      const userHash = SHA256(password + userSalt).toString(encBase64);
      const userToken = uid2(64);

      const newUser = await new User({
        email: req.fields.email,
        username: req.fields.username,
        token: userToken,
        hash: userHash,
        salt: userSalt,
      });

      await newUser.save();

      const resNewUser = {
        token: newUser.token,
        username: newUser.username,
      };

      res.status(200).json({ message: "Signed up successfully", resNewUser });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });

    if (user) {
      const password = req.fields.password;
      const newHash = SHA256(password + user.salt).toString(encBase64);

      if (newHash === user.hash) {
        const resUser = {
          _id: user.id,
          token: user.token,
          account: user.account,
        };

        res.status(200).json({ message: "Logged in !", resUser: resUser });
      } else {
        res.status(400).json({ message: "Wrong password" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized : user not recognized" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
