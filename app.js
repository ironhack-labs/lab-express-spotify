require('dotenv').config();
require('./config/dbConnect');

const express = require('express');
const hbs = require('hbs');
const app = express();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
// app.use(logger('dev'));
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

const indexRouter = require('./routes/index');
const artistRouter = require('./routes/artist');
const albumRouter = require('./routes/albums');
const trackRouter = require('./routes/tracks');

app.use('/', indexRouter);
app.use('/artist-search', artistRouter);
app.use('/albums/:artistId', albumRouter);
app.use('/albums/:albumId/tracks', trackRouter);

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:

app.listen(3000, () =>
  console.log('My Spotify project running on http://localhost:3000 🎧 🥁 🎸 🔊')
);

module.exports = app;
