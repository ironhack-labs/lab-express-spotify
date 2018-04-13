const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
// app.set('public', __dirname + '/public');
app.use(express.static(path.join(__dirname, 'public')));

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'fa88d24fead447cc8c35aa96e9bd1249',
    clientSecret = '58a15e72c6a84291b1366a081b8043d4';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get("/", (req, res, next) => {
  res.render("layouts/home-page");
});

app.get("/search", (req, res, next) => {
  console.log(req.query.q);
  const searchName = req.query.q;
  spotifyApi.searchArtists(req.query.q)
  .then(data => {
    // array of artists (objects)
    let listArtists = data.body.artists.items
    const n = listArtists.length;
    res.render("layouts/artists", {searchName, listArtists})
  })
  .catch(err => {
    console.log("Error while searching for an artist", err);
  })
});


app.get('/albums/:artistId', (req, res) => {
  
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    let listAlbums = data.body.items;
    let artName = listAlbums[0].artists[0].name;
    res.render("layouts/albums", {listAlbums, artName});
  })
  .catch(err => {
    console.log("Albums page failed!", err);
  })
});


app.get('/albums/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data => {
    let listTracks = data.body.items;
    res.render("layouts/tracks", {listTracks})
  })
  .catch(err => {
    console.log("Tracks page failed!", err);
  });
})


app.listen(3000, () => {
  console.log("Spotify is online!");
});