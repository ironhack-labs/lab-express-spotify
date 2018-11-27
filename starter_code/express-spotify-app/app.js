const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
hbs.registerPartials(__dirname + "/views/partials");

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = '53596dcf73f44f81a482e00c18abee3a',
    clientSecret = '5a2084913d5a4220a5c541e77ba75003';

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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/artists', function (req, res) {
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        console.log(data.body.artists.items)
        var searchedList = { artistList : data.body.artists.items }
        res.render('artist', {searchedList})
    })
    .catch(err => {
      console.log("Erreur, déso")
    })
  })

app.listen(3000, () => console.log('Example app listening on port 3000!'))
