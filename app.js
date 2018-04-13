// Client ID :2b22aa4c701a4168849ca85e39fec842
// Client Secret :ac2ff96350f94a70b455faf94f11dbe3

const express = require('express');
const app = express();
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.set("layout", __dirname + "/views/layout.hbs");

// Remember to paste here your credentials
var clientId = '2b22aa4c701a4168849ca85e39fec842',
    clientSecret = 'ac2ff96350f94a70b455faf94f11dbe3';

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

// /:artist

// ?artist=

app.get("/", (req, res, next)=>{
  res.render("home-page");
});

app.get("/artist", (req, res, next) => {
  // res.render()
  
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      const chosArtist = data.body.artists.items;  
      console.log(chosArtist[0].images[0].url);
      res.render("artist", {chosArtist});
    })
    .catch(err => {
     console.log("ERROR WTF", err);
    });
})

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data =>{
    const album = data.body.items;
    console.log(album);
    res.render("albums", {album});
  })
  .catch(err => {
    console.log("ERROR WTF", err);
   });
});

app.get('/tracks/:albumId', (req, res, next) => {
spotifyApi.getAlbumTracks(req.params.albumId)
.then(data =>{
  const track = data.body.items;
  console.log(track);
  res.render("tracks", {track});
})
.catch(err => {
  console.log("ERROR WTF", err);
 });
});


    app.listen(3000, () => {
      console.log("App is running!");
    })