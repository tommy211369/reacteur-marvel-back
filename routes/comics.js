const express = require("express");
const router = express.Router();
const axios = require("axios");

// get comics list
router.get("/comics", async (req, res) => {
  try {
    let title = req.query.title;
    let skip = req.query.skip;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}&limit=100&skip=${skip}&title=${title}`
    );

    // list of comics from Le Reacteur API
    const comics = response.data.results;

    // filter by title
    res.json({
      count: response.data.count,
      comics: comics,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get comics list containing a specific character
router.get("/comics/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.id}?apiKey=${process.env.API_KEY}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
