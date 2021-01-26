require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Register the location for handlebars partials here:

// hbs.registerPartials(__dirname + '/views/partials')

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
    res.render ('index')
})

app.get('/artist-search', (req, res, next) => {
    //console.log(req.query.nameArtist)
    spotifyApi
    .searchArtists(req.query.nameArtist)
      .then(data => {
        //console.log(data.body.artists.items)
        res.render('artist-search-result', { artist: data.body })
      })
        //console.log('The received data from the API: ', data.body)       
    .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:id', (req, res, next) => {
  //console.log(req.params.id)
  spotifyApi
  .getArtistAlbums(req.params.id)
    .then(data => {
      //console.log(data.body.items)
      res.render('albums', { albums: data.body })
  })
  .catch(err => console.log('The error while searching albums occurred: ', err))
})

app.get('/tracks/:id', (req, res, next) => {
  //console.log(req.params.id)
  spotifyApi
  .getAlbumTracks(req.params.id)
    .then(data => {
      //console.log(data.body.items)
      res.render('tracks', { tracks: data.body })
  })
  .catch(err => console.log('The error while searching tracks occurred: ', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

