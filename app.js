require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

//set route for static filesas
app.use(express.static(__dirname + '/public'));
console.log(__dirname + '/public')


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

app.get('/', (req, res, next) => {
  res.render("index");
} );

app.get('/artist-search', (req, res, next) => {

  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {

    let artists = data.body.artists.items;
    //console.log("Info succesfully retrieved: ", data.body.artists.items[0]);
    res.render("artist-search-results", {artists});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get('/albums/:artistID', (req, res, next) => {
  
  spotifyApi
  .getArtistAlbums(req.params.artistID)
  .then(data => {
    let albums = data.body.items
    console.log("Albums: ", albums[0]);
    res.render("albums", {albums});
  })
  .catch(err => console.log(err));

});


app.get("/albums/:artistID/tracks", (req, res, next) => {

  spotifyApi
  .getAlbumTracks(req.params.artistID)
  .then(data => {

    let tracks = data.body.items;
    res.render("tracks", {tracks});

  })
  .catch(err => console.log(err));

});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
