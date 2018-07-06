const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyparser = require("body-parser");
const debug = require('debug')('spotify:app');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials');


var SpotifyWebApi = require('spotify-web-api-node');


var clientId = 'ca761f6905f1401ca68f5a313b292d8e',
    clientSecret = '6bbab67fcd024ea4a4a965145909dbbf';

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

  res.render('index');
});

app.get("/artist", (req, res, next) => {
    
    spotifyApi.searchArtists(req.query.artist)
      .then(data => {
          console.log(data)
          res.render('artist', {data: data.body.artist.items});
        })
        .catch(error => {
            console.log(error);
          });
    
        });
    
app.listen(3000, () => console.log("Escucho"));







