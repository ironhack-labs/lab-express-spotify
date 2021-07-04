require('dotenv').config();

const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
const index = require('./routes/index.js')
app.use('/', index);

const artistRoutes = require('./routes/artist.routes')
app.use('/', artistRoutes)


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
