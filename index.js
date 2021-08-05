require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// routes import
const characterRoutes = require("./routes/character");
const comicsRoutes = require("./routes/comics");
const userRoutes = require("./routes/user");
app.use(characterRoutes);
app.use(comicsRoutes);
app.use(userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome on Marvel API !" });
});

app.all("*", (req, res) => {
  res.json(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started on port : " + process.env.PORT);
});
