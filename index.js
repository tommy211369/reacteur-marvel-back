require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const formidable = require("express-formidable");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
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
