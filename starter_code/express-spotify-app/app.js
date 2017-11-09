'use strict';

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '01ef10a509834304a23b60664a509de9',
    clientSecret = '6e51ea6946324820863b8eb6214fd0e9';

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
    });


//setup

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// first Route
app.get('/', (req, res) => {
    console.log(req);
    res.render('index.ejs');
});

//artists
app.get('/artists', (req, res) => {
    spotifyApi.searchArtists().then((result) => {
            const data = {
                artist: result
            };
            res.render('artist', {
                data
            });
        })
        .catch((err) => {
            console.log(err);
        });
});



//listen

app.listen(3000);
