const express = require('express');
const hbs = require('hbs');
const path = require("path");
const app = express();
require('dotenv').config();

// default value for title local
app.locals.title = "Express Routes Example";

// Setting up views:
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

// Our routes go here:
app.use("/", require("./routes/index"));

app.use('/', require("./routes/spotify"));

app.listen(process.env.PORT, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

module.exports = app;