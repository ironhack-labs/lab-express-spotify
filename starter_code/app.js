require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


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


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



// the routes go here:
const mainRoutes = require('./route/index');
    app.use("/", mainRoutes);


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
