require("dotenv").config();
const express = require("express");
const hbs = require("hbs");

//IMPORT ROUTES
const searchRoute = require("./routes/searchRoute");
const albumsRoute = require("./routes/albumsRoute");
const tracksRoute = require("./routes/tracksRoute");

const app = express();

//VIEW ENGINE
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

//STATIC & PARTIALS
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

//ROUTES
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/artist-search", searchRoute);
app.use("/albums/", albumsRoute);
app.use("/tracks/", tracksRoute);

//SERVER
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
