require('dotenv').config();

const { query } = require('express');
const express = require('express');
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
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  const query = req.query.artist;
  spotifyApi
  .searchArtists(query)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render("artist-search-results", data.body.artists);
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:artistId", (req, res) => {
  const album = req.params.artistId;
  spotifyApi
  .getArtistAlbums(album)
  .then (data => {
    console.log('The received data from the API: ', data.body);
    res.render('albums', data.body)
}) 
});

app.get("/tracks/:albumId", (req, res) => {
  const track = req.params.albumId;
  spotifyApi
  .getAlbumTracks(track)
  .then (data => {
    console.log('The received data from the API: ', data.body);
    res.render('tracks', data.body)
}) 
});
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
