require("dotenv").config()
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials");


// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    console.log(data)
    spotifyApi.setAccessToken(data.body['access_token'])})
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res, next) => {

    res.render("homepage")

})

app.get("/artist-search", (req, res, next) => {

  const artistName = req.query.artistname

  spotifyApi
  .searchArtists(artistName)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    
    res.render("artist-search-results", {artists: data.body.artists.items})

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get("/albums/:artistId", (req, res, next) => {
  
  const artistId = req.params.artistId
  spotifyApi
  .getArtistAlbums(artistId)
  .then(albumData => {
    console.log('The received album data from the API:', albumData.body)
    res.render("albums", {albums: albumData.body.items})
  })
  .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get("/tracks/:albumId", (req, res, next) => {
  
  const albumId = req.params.albumId
  spotifyApi
  .getAlbumTracks(albumId)
  .then(trackData => {
    console.log('The received track data from the API:', trackData.body)
    res.render("tracks", {tracks: trackData.body.items})
  })
  .catch(err => console.log('The error while searching track occurred: ', err));
});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
