require('dotenv/config');

const express = require('express');
const hbs = require('hbs');

require('./config/hbs.config');

const spotifyApi = require('./config/spotify.config');

const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));


// Our routes go here:

const routes = require('./config/routes.config');
app.use('/', routes);
  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
