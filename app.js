require('dotenv').config();

const colors = require("colors");
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
  res.render("index");
})

app.get("/artist-search", (req, res, next) => {
  const artistName = req.query.artist;

  spotifyApi
  .searchArtists(artistName)
  .then(data => {
    //console.log('The received data from the API: ', data.body);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
   
    const obj = data.body.artists ;
    //console.log(obj.items[0])
    res.render("artist-search-results", obj)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:id", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.id)
  .then(function(data) {
    //console.log('Artist albums', data.body.items[0].total_tracks);
    const obj = data.body

    res.render("albums", obj)
  })
  .catch(function(err) {
    console.error(err);
  });
})

app.get("/tracks/:id", (req, res, next) => {
  const tracksId = req.params.id
  
  spotifyApi.getAlbumTracks(tracksId)
  .then(function(data) {
    console.log(data.body.items[0].preview_url);
    const { body}= data
    res.render("tracks", body)
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

app.listen(3005, () => console.log('My Spotify project running on port 3005 🎧 🥁 🎸 🔊'));

