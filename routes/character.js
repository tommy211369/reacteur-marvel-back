const express = require("express");
const router = express.Router();
const axios = require("axios");

// get all characters
router.get("/characters", async (req, res) => {
  try {
    let skip = req.query.skip;

    let name = req.query.name;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}&skip=${skip}&name=${name}`
    );

    // list of characters from Le Reacteur API
    const characters = response.data.results;

    res.status(200).json({
      count: response.data.count,
      charac: response.data,
      characters: characters,
    });
  } catch (error) {
    res.status(400).json({ errorCharactersRouteMessage: error.message });
  }
});

module.exports = router;
