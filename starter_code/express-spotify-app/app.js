'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressLayout = ('express-ejs-layouts')
const morgan = ('morgan');
const prettyJson = ('prettyjson');
const SpotifyWebApi = require('spotify-web-api-node');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');

app.use(express.static('public'));
app.use(expressLayout);

const clientId = 'd17fafe17aa54df9bb46225b9e12ad73',
    clientSecret = '64539cd3259b4accbbb28a259f3eb3db';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then((data) => {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, (err) => {
        console.log('Something went wrong when retrieving an access token', err);
    });

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/artist', (req, res) => {

    let artistSearched = req.body.artist;

    spotifyApi.searchArtists(artistSearched)
        .then((data) => {
        res.render('artist', {data: body.artist.items});
        }, function (err) {
            console.error(err);
        });
});

app.get('/albums/:artistId', (req, res) => {

    let artistId = req.params.artistId;

    spotifyApi.getArtistAlbums(artistId)
        .then((data) => {
            console.log(data);
            res.render('albums', { data: data.body.items[0].name });
        }, function (err) {
            
            console.error(err);
        });
});

// Server
app.listen(8000, () => {
    console.log('Easy server 8000!');
});