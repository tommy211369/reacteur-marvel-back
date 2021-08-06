const express = require("express");
const router = express.Router();
const axios = require("axios");

// get all characters
router.get("/characters", async (req, res) => {
  try {
    let skip = req.query.skip;

    let name = req.query.name;
    let regName = new RegExp(name, "i");

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}&skip=${skip}&limit=100`
    );

    // list of characters from Le Reacteur API
    const characters = response.data.results;
    // const CHARACTERS = [];

    // response
    res.status(200).json({
      count: response.data.count,

      characters: characters
        .map((character) => {
          if (character.name.search(regName) === -1) {
            return null;
          }
          return character;
        })
        .filter((elem) => elem !== null),
    });

    // characters
    //   .map((character) => {
    //     if (character.name.search(regName) === -1) {
    //       return null;
    //     }
    //     return CHARACTERS.push(character);
    //   })
    //   .filter((elem) => elem !== null);

    // res.json(CHARACTERS);
  } catch (error) {
    res.status(400).json({ errorCharactersRouteMessage: error.message });
  }
});

module.exports = router;
