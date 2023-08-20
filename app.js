require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const spotify = require("./config/spotify.config.js");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const router = require("./config/routes.config.js");
app.use(router);

// setting the spotify-api goes here:

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
