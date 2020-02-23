require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token'], console.log("Token access done")))
  .catch(error => console.log('Something went wrong when retrieving an access token', error, process.env.CLIENT_ID ));


// setting the spotify-api goes here:

// Our routes go here:

app.listen(4000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
