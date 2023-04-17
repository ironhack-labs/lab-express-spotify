require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

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

app.get("/", function(req, res) {
  res.render("index")
})

// Iteration 3

app.get("/artist-search", (req, res) => {
  const queryString = req.query.artist
  
  spotifyApi
  .searchArtists(queryString)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items[0]);

    const searchedArtist = data.body.artists.items
    res.render("artist-search-results", { searchedArtist })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

// Iteration 4

app.get('/albums/:artistId', (req, res, next) => {
const artistId = req.params.artistId

  spotifyApi
  .getArtistAlbums(artistId)
  .then(data => {
    const artistAlbums = data.body.items
    res.render("albums", { artistAlbums })
  })
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


