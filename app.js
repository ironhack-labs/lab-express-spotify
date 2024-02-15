require('dotenv').config();

require('./configs/spotify.config');

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

const routes = require('./configs/router.config');
app.use('/', routes)

const port = 3000;
app.listen(port, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
