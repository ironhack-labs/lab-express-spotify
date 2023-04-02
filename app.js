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
app.get("/", (req, res) => {
    res.render("home");
  });

const baseAPIRoute = "https://api.spotify.com/v1/artists/";


app.get("/artist-search", (req, res) => {
    console.log(req.query.artist);
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render("artist-search-results", { artists: data.body.artists.items});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get("/albums:artistId", (req, res) => {
  spotifyApi
  .getAlbums(req.query.artist)
  .then(function(data) {
    console.log('Albums information', data.body);
    res.render("albums", { albums: data.body.artists.items});
  }, function(err) {
    console.error("Error while displaying albums:" , err);
  });



});

app.listen(4000, () => console.log('My Spotify project running on port 4000 🎧 🥁 🎸 🔊'));
