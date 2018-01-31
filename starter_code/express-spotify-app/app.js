"use strict"

var SpotifyWebApi = require('spotify-web-api-node');

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

app.get('/', (req, res) => {
    res.render("index");
  });

app.get('/random', (req, res, next) => {
    client
    .getRandomJoke()
    .then(response => {
        res.send(`<p> ${response.value} </p>`);
    })
    .catch(err => {
        console.log(err);
    });
})