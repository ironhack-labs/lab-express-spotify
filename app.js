require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


app.get("/", (req, res, next) => {
  res.render('index');
});

app.get("/artist-search", (req, res, next) => {
  let {artist} = req.query;
  spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log(data.body.artists.items[0].images)
    res.render("artist-search-results", { artist: data.body.artists.items});

    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});





// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));






// setting the spotify-api goes here:

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
