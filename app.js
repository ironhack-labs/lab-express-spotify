require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID, // If I put an ID as such - it would be a bad practice, since I am sharing it with everybody
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
})

// setting the spotify-api goes here:

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error))

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Our routes go here:

app.get('/', function (req, res) {
  res.render('index') // render expects to work with handlebars

  // req.query.artist
})

app.get('/artist-search', function (req, res) {

  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search', data.body.artists)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/album/:id', function (req, res) {
  spotifyApi.getArtistAlbums(req.params.id)
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));