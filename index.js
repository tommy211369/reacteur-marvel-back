require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

// routes import
const characterRoutes = require("./routes/character");
const comicsRoutes = require("./routes/comics");
app.use(characterRoutes);
app.use(comicsRoutes);

app.all("*", (req, res) => {
  res.json(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started on port : " + process.env.PORT);
});
