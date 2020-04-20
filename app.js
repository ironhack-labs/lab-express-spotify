require('dotenv').config();

// Express setup
const express = require('express');
const hbs = require('hbs');

// App setup
const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use('/', require('./routes/index'));
app.locals.title = 'Spotify Index';

// API setup
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
const port = spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Server setup
app.listen(process.env.PORT, () =>
  console.log(
    `Spotify project running on port http://localhost:${process.env.PORT} 🎧 🥁 🎸 🔊`
  )
);
