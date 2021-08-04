const express = require("express");
const router = express.Router();
const axios = require("axios");

const CHARACTERS = [];

const fetchCharacters = async () => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}`
    );

    // list of characters from Le Reacteur API
    CHARACTERS.push(response.data.results);
  } catch (error) {
    console.log(error.message);
  }
};

fetchCharacters();

// get all characters
router.get("/characters", async (req, res) => {
  try {
    let { title, page } = req.query;

    let filters = {};

    if (title) {
      filters.name = new RegExp(title, "i");
    }

    let currentPage;

    if (Number(page) < 1) {
      currentPage = 1;
    } else {
      currentPage = Number(page);
    }

    // new tab of characters with filters
    const characters = await CHARACTERS.find(filters).skip(
      (currentPage - 1) * 100
    );

    res.status(200).json(characters);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
