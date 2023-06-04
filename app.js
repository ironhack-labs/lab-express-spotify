require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

spotifyApi.searchArtists()


// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log("Worked", data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
app.get("/", (req, res, next) => {
  spotifyApi
    .searchArtists("madonna")
    .then((data) => {
      console.log(data.body.artists.items[0].images);
    })
    .catch((error) => console.log(error));
});

app.get("/", (req, res, next) => {
  res.render("home-page");
});

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
});

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
