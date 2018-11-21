const express = require('express');
const app = express();
const axios = require ("axios")

var apiConfig = require("../config")

var clientId = apiConfig.clientId;
var clientSecret = apiConfig.clientSecret;

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
});

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

app.post("/", function(req, res){
  let theArtist = req.body.artist
  let artistName = capitalizeFirstLetter(theArtist)

  spotifyApi.searchArtists(theArtist)
  .then((result) => {
    res.render("artists", {artistList: result.body.artists.items, artistName: artistName})
  })
  .catch((err) => {
    res.send("Error", err)
    //throw err
  })
})

app.get('/albums/:artistId', (req, res) => {
  let artistId = req.params.artistId

  spotifyApi.getArtistAlbums(artistId)
  .then((result) => {
    res.render("albums", {artistAlbums: result.body.items})
  })
  .catch((err) => {
    res.send("Error", err)
  });
})

app.get('/albums/tracks/:albumId', (req, res) => {
  let albumId = req.params.albumId
  let nameAlbum = req.query.nameAlbum

  spotifyApi.getAlbumTracks(albumId)
  .then((result) => {
    res.render("tracks", {albumTracks: result.body.items, nameAlbum: nameAlbum})
  })
  .catch((err) => {
    res.send("Error", err)
  });
})

module.exports = app;
