const SpotifyWebApi = require('spotify-web-api-node')
const clientId = "84f1113ab53f470386ad7b5f094e83b6"
const clientSecret = "d603551a282d4262a59ce5afd8cb14a9"
const express = require('express');
const app = express();
const hbs = require('hbs');

app.set("views", __dirname + "/views")
app.set("view engine", "hbs")

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
})

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get("/", (req, res) => {
  res.render("homepage")
})

app.get("/artists", (req, res) => {

  spotifyApi.searchArtists(req.query.artist)
  .then(data => {
    let resultArray = data.body.artists.items
    res.render("artistresult", {resultArray})
  })
  .catch(err => {
   console.log("an error occured!" + err)
  })

})

app.get("/albums/:artistId", (req, res) => {

spotifyApi.getArtistAlbums(req.params.artistId).then(
  function(data) {
    let myObject = data.body.items;
    res.render("albums", {myObject})
  },
  function(err) {
    console.error(err);
  }
);

})

app.get("/tracks/:trackId", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.trackId)
  .then(function(data) {
      let myObject = data.body.items
      res.render("trackPreview", {myObject})
  }, function(err) {
    console.log('Something went wrong!', err);
  });


})

app.listen(3000)

