require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const hbs = require('hbs');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Our routes go here:
const spotifyRoutes = require('./routes/spotify-routes.js');
app.use('/', spotifyRoutes);

app.get('/', (req, res) => {
    res.redirect('/home')
});

app.get('/home', (req, res) => {
    res.render('home')
});





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
