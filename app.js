require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Our routes go here:
const spotifyRoutes = require('./routes/spotify.routes');
app.use('/', spotifyRoutes);

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
