require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser')

// require spotify-web-api-node package here:
const spotifyApi = require('./config/spotify.config')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.use('/', require('./routes'))

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
