require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// Our routes go here:
const homeRoute = require('./routes/home.routes.js')
const artistRoute = require('./routes/artist-search.routes.js')
const albumsRoute = require('./routes/albums.routes.js')
const tracksRoute = require('./routes/tracks.routes.js')
app.use("/", homeRoute)
app.use("/artist-search", artistRoute)
app.use("/albums", albumsRoute)
app.use("/tracks", tracksRoute)

app.listen(3000, () => console.log('My Spotify project running on http://localhost:3000 🎧 🥁 🎸 🔊'));
