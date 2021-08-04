const express = require("express");
const router = express.Router();
const axios = require("axios");

// get all characters
router.get("/characters", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?limit=0&apiKey=${process.env.API_KEY}`
    );
    res.status(200).json(response.data.results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
