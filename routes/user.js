const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const isAuthenticated = require("../middlewares/isAuthenticated");

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
        favorites: [],
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
          username: user.username,
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

// post favorites
router.post("/user/favorites", isAuthenticated, async (req, res) => {
  try {
    let { itemId, itemType, itemTitle, userName } = req.fields;

    const user = await User.findOne({ username: userName });

    // exist : item already in DB
    const exist = user.favorites.find((elem) => elem.id === itemId);
    // index : index of this item
    const index = user.favorites.indexOf(exist);

    if (!exist) {
      user.favorites.push({
        id: itemId,
        type: itemType,
        title: itemTitle,
        userName: userName,
      });
      await user.save();
      res
        .status(200)
        .json({ message: `Item add to ${userName} favorites`, num: 1 });
    } else {
      // remove from favorites
      user.favorites.splice(index, 1);

      await user.save();

      res
        .status(200)
        .json({ message: `Item remove from ${userName} favorites`, num: 2 });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// get user favorites
router.get("/favorites", async (req, res) => {
  try {
    let token = req.query.token;

    const user = await User.findOne({ token: token });

    // userFavorites : get user favorites
    const userFavorites = user.favorites;

    res
      .status(200)
      .json({ message: `${user.username} favorites`, userFavorites });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
