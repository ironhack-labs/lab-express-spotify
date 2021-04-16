require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
app.get('/', (req, res) => {
    res.render('index');
})
app.get('/artist-search', (req, res) => {
    spotifyApi
  .searchArtists(req.query.artistName)
  .then(data => {
    const artistArr = data.body.artists.items
    res.render("artist-search-results", {artistArr})
    console.log('The received data from the API: ', data.body);
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

//Get Albums
app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    const albumsArr = data.body.items
    res.render('albums', {albumsArr} )
  })
  .catch(error => console.error(error))
})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

//Get Tracks
app.get('/album-traks/:trackId', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.trackId)
  .then(data => {
    const tracksArr = data.body.items;
    console.log(tracksArr)
    res.render('album-traks', {tracksArr})
  })
  .catch(error => (error))
})