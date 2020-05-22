require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
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
app.get("/", (req,res,next) => {
    res.render("index")
})

app.get("/artist-search", (req,res,next) => {
  let artist = req.query.artist
  spotifyApi.searchArtists(artist).then(data => {
    // res.send(data)
    res.render("artist-search-results",{data}), err => console.error("An error occured : ", err)
  })
})

app.get("/albums/:artistId", (req,res,next) => {
  let id = req.params.artistId
  spotifyApi.getArtistAlbums(id).then(data => {
    // res.send(data)
    res.render("albums",{data}), err => console.error("An error occured : ", err)
  });
})

app.get("/view-tracks/:albumId", (req,res,next) => {
  let id = req.params.albumId
  spotifyApi.getAlbumTracks(id).then(data => {
    // res.send(data)
    res.render("tracks",{data}), err => console.error("An error occured : ", err)
  });
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
