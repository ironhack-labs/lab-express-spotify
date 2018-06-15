/* jshint esversion: 6 */


var SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const path    = require('path');
const hbs = require('hbs');
const prettyjson = require('prettyjson');
const bodyParser = require('body-parser');
const morgan =        require("morgan");

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.set('view options', { layout: '/layouts/layout' });

// app.set('view engine', 'hbs');
// app.use(bodyParser.urlencoded({ extended: true }));


var clientId = '6e1dd9bf5e95434dba0258be794a82e0',
    clientSecret = '1e97397a640245acb393779514baed5f';

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



app.get('/', (req, res) => 
{
    res.render(`index`);
});



app.get('/artists', (req, res) => {
  let artist = req.query.artist;
  console.log(req.query.artist);

  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      console.log(data.body.artists.items)
      res.render("artists", data)
    })
    .catch(err => {
    });
});






app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});