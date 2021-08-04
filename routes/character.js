const express = require("express");
const router = express.Router();
const axios = require("axios");

// get all characters
router.get("/characters", async (req, res) => {
  try {
    let characterName = new RegExp("Abyss", "i");

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}`
    );

    // list of characters from Le Reacteur API
    const CHARACTERS = response.data.results;
    console.log("Characters from API : ", CHARACTERS);

    const characters = await CHARACTERS.find(
      (character) => character.name === characterName
    );

    console.log(characters);
    res.status(200).json({ list: characters });
  } catch (error) {
    // console.log({ errorCharactersRouteMessage: error.message });
    res.status(400).json({ errorCharactersRouteMessage: error.message });
  }
});

module.exports = router;
