//Dependencies
require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// the routes go here:
app.get('/', (req, res) => res.render('home'));

app.get('/artists', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.artistName)
  .then(data => {
    const queryData = data.body.artists.items;
    console.log('The received data from the API: ', queryData);
    res.render('artists', {queryData});
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
});

app.get('/albums:artistID', (req, res, next) => {
  console.log(req.params.artistID)
  spotifyApi
  .getArtistAlbums(req.params.artistID.slice(1))
  .then(data => {
    console.log(data);
    const queryData = data.body.items;
    console.log('The received data from the API: ', queryData);
    res.render('albums', {queryData});
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
});

app.get('/album-tracks:albumID', (req, res, next) => {
  console.log(req.params.albumID)
  spotifyApi
  .getAlbumTracks(req.params.albumID.slice(1))
  .then(data => {
    console.log(data);
    const queryData = data.body.items;
    console.log('The received data from the API: ', queryData);
    res.render('album-tracks', {queryData});
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
