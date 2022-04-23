require('dotenv').config();


const { response } = require('express');
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

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artist-search-results", (req, res, next) => {

  spotifyApi.searchArtists(`${req.query.artist}`, {limit: 50})
  .then(response => {
    // console.log(response.body.artists.items);

    res.render("artist-search-results",{artistsArr: response.body.artists.items})
  })
  .catch(error => console.log("There was an error getting the artists:", error));
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(response => {
    // console.log(response.body.items);

    res.render("albums", {albumsArr: response.body.items})
  })
  .catch(error => console.log("There was an error getting the albums:", error));
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(response => {
    console.log(response.body.items);

    res.render("tracks", {tracksArr: response.body.items})
  })
  .catch(error => console.log("There was an error getting the albums:", error));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
