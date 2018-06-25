const express = require('express');
const app = express();
const hbs = require('hbs');

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'f785ec20521543a79757a12a58228670',
    clientSecret = 'caf6264711d34cb48e5108d06442157f';

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

// -- ROUTES ---

// retrieve main page
app.get("/", (req, res, next) => {
  console.log("index requested");
  res.render("home-page.hbs");
});

// retrieve artist from input form
app.get("/artists", (req, res, next) => {
  console.log( req.query.artists )
  spotifyApi.searchArtists( req.query.artists )
  .then(data => {
    console.log(data.body.artists);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    var artists = data.body.artists.items;
   // res.send(data)
    // const artists = data.body.artists.items;
    // console.log(artists)
    res.render("artists.hbs", {artists: data.body.artists.items} );
  })
  .catch(err => {
    // ----> 'HERE WE CAPTURE THE ERROR'
    res.send("error");
  })

  app.get('/albums/:artistId', (req, res, next) => {
      spotifyApi.getArtistAlbums(req.params.artistId)
      .then(data => {
        let albums = data.body.items;
        console.log(albums);
        res.render('albums.hbs', {albums});
      })
      .catch(err => {
        console.log(error)
      })
    });

});




app.listen(3000, () => {
  console.log("SPOTIFY STORE ONLINE 🍇 🥥 🍌");
});
