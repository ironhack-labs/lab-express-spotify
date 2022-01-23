require('dotenv').config();

const express = require('express');
const req = require('express/lib/request');
const hbs = require('hbs');

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
app.get('/', (req, res, next) => {
    // console.log(req);
    res.render('homepage');
  });

  app.get('/artist-search',(req, res, next) => {
    // console.log("req.query-->",req.query.artist);
    spotifyApi
      .searchArtists(req.query.artist)
      .then(data => {
      // console.log('The received data from the API: ', data.body.artists.items);
      let artistFromApi = data.body.artists.items;
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results', {artistFromApi});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));  
 });

  // .getArtistAlbums() code goes here

app.get('/albums/:artistId', (req, res, next) => {
  // console.log(req.params)
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    // console.log('The received data from the API: ', req.params.artistId);
    let artistAlbums = data.body.items;
    // console.log(artistAlbums)
      res.render('albums', {artistAlbums});
    })
    .catch (err => console.log(err));
})

app.get('/albums/tracks/:tracksId', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.tracksId, { limit : 5, offset : 1 })
  .then(data => {
    let tracks = data.body.items;
    console.log(tracks);
    res.render('tracks', {tracks})

  })
  .catch(err => console.log('Something went wrong!', err));
});

app.listen(4000, () => console.log('My Spotify project running on port 4000 🎧 🥁 🎸 🔊'));
