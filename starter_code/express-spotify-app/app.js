"use strict"

var SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

//config app
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Remember to paste here your credentials
var clientId = 'ee6adcb5d950407989fe1b589bbf7555',
    clientSecret = 'ca66810d1824435685290d58ca87da74';

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

app.get('/', (req, res, next) => {
    res.render('start');
  });

// search for an artist - spotifyAPI fct

app.get("/artists", (req, res, next) => {
    spotifyApi.searchArtists(req.query.artists)
        .then((data) => {
          var artists = data.body.artists.items;
          res.render("artists", {artists});
        }, function(err) {
          console.log(err);
        });
});

app.get("/album/:artistId", (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(function(data) {
            var album = {
            album: data.body.items
        };
            res.render("album", album)
        }, function(err) {
            console.log(err);
        });
});

//start app
app.listen(3020, () => {
   console.log('Spotify Search DE. 3020!')
});
