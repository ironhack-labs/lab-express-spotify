require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require("path");

// require spotify-web-api-node package here:

const app = express();

// default value for title local
app.locals.title = "Express Routes Example";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

// setting the spotify-api goes here:

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CID,
    clientSecret: process.env.SPOTIFY_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.use("/", require("./routes/index"));
const artistRoute = require('./routes/artists.js');
app.use('/', artistRoute);

app.listen(process.env.PORT, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

module.exports = app;