const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
const clientId = '1c30624cba6742dcb792991caecae571',
    clientSecret = '746977b1e77240faa9d0d2411c3e0efe';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

const app = express();

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });

    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');

    app.get('/artist', (req, res, next) => {
        // send views/index.ejs for displaying in the browser
        res.render('artist');
      });