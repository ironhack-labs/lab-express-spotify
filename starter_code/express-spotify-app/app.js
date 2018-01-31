const express = require('express');
const app = express();
var SpotifyWebApi = require('spotify-web-api-node');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Remember to paste here your credentials
var clientId = '947b1ba25ceb4742a4b23996462b02e2',
    clientSecret = '94c13bb862864e7c921e1347b4277e98';

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

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/artists', (req, res) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(function(data) {
            res.render('artists-list', {items : data.body.artists.items});
        }, function(err) {
            console.error(err);
        });
});

 app.listen(3000, () => {
    console.log('My first app listening on port 3000!')
});