require('dotenv').config()
const express = require('express');
const hbs     = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");


// require spotify-web-api-node package here:
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
//adding API
const spotifyApi = new SpotifyWebApi({
    // clientId: "87439de1fe9d4bd99795083126aba1bb",
    // clientSecret: "95b805c5f0054a6e9e6a58a442334894"
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
    console.log("Showing the main index page");
    
    res.render('index');
});

app.get('/artists', (req, res, next) => {
  console.log(req.query);
  spotifyApi
  .searchArtists(req.query.artistName)
  .then(data => {
    console.log("The received data from the API: ", data.body);
    //'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artists', {artist: data.body.artists.items});
  })
  .catch(err => {
    console.log("The error file searching artists occurred: ", err);
  });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
