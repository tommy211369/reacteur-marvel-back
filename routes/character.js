const express = require("express");
const router = express.Router();
const axios = require("axios");

// get all characters
router.get("/characters", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}`
    );

    // list of characters from Le Reacteur API
    let CHARACTERS = response.data.results;

    res.status(200).json(CHARACTERS);
  } catch (error) {
    // console.log({ errorCharactersRouteMessage: error.message });
    res.status(400).json({ errorCharactersRouteMessage: error.message });
  }
});

module.exports = router;
