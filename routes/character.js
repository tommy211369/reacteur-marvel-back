const express = require("express");
const router = express.Router();
const axios = require("axios");

// get all characters
router.get("/characters", async (req, res) => {
  try {
    let name = req.query.name;
    let regName = new RegExp(name, "i");

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}`
    );

    // list of characters from Le Reacteur API
    const CHARACTERS = response.data.results;

    // character name filter
    res.json(
      CHARACTERS.map((character) => {
        if (character.name.search(regName) === -1) {
          return null;
        }
        return character;
      }).filter((elem) => elem !== null)
    );
  } catch (error) {
    res.status(400).json({ errorCharactersRouteMessage: error.message });
  }
});

module.exports = router;
