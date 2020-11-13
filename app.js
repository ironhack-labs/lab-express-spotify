const dotenv         = require('dotenv');
const chalk         = require('chalk');
const mongoose      = require('mongoose');
const bodyParser    = require('body-parser');
const express       = require('express');
const hbs           = require('hbs');

// require spotify-web-api-node package here:
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');

// .env
dotenv.config();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// HBS
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Our routes go here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => {
    console.log(`Something went wrong when retrieving an access token: ${error}`)
  });

app.get('/', (req, res, next) => {
  res.render('home');
})

app.get('/artist-search', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artistSearch)
  .then(data =>{
    ('the received data from the API: ', data.body)
    const search = data.body.artists.items;
    res.render('artistSearchResults', {search})
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
    res.send(err);
  });
})

app.get('/albums/:id', (req, res, next)=> {
  spotifyApi.getArtistAlbums(req.params.id)
  .then(data => {
    const albums = data.body.items;
    res.render("albums", {albums});
  })
  .catch(err =>{
    console.log('The error while showing albums: ', err);
    res.send(err);
  })
})

app.get('/tracks/:albumID', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumID)
  .then(data => {
    const tracks = data.body.items;
    res.render('tracks', {tracks})
  })
  .catch(err => {
    console.log('The error while is loading tracks is: ', err);
    res.render(err);
  })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
