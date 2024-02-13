require('dotenv').config();
const spotifyApi = require('./configs/spotify.config');
const express = require('express');



require('./configs/hbs.config');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
const routes = require('./configs/routes.config');
app.use('/', routes);

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
