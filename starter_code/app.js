require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");

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
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  let search = req.query;
  spotifyApi
    .searchArtists(
      search.artist
    )
    .then(function (data) {
      console.log("The received data from the API: ", data.body);
      res.render('artists', data.body);
    })
    .catch(function (err) {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.listen(3001, () => console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊"));