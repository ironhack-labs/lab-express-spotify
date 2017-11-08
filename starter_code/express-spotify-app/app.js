const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const app = express();

// Middleware setup
app.use(bodyParser());
app.use(express.json());
app.use(expressLayouts);
app.use(express.static('public'));

app.set('layout', __dirname + '/views/layout/main-layout');
app.set('view engine', 'ejs');

// Remember to paste here your credentials
var clientId = 'a664614360e040e588fe18ba8a2e6edd',
    clientSecret = '4f0e07f4805a4ba8a6923e798207c012';

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


// Controllers
app.get('/', (request, response) => {
    response.render('index');
});

app.post('/artist', (request, response) => {
    let data = request.body;
    spotifyApi.searchArtists(data.artist)
        .then(function(data) {
            let artists = data.body.artists.items;
            response.render('artist', {artists});
        }, function(err) {
            console.error(err);
        });
});

app.get('/albums', (request, response) => {
    let artistId = request.query.id;
    spotifyApi.getArtistAlbums(artistId)
        .then(function(data) {
            let albums = data.body.items;
            response.render('albums', {albums});
        }, function(err) {
            console.error(err);
        });
});





// Start Server
app.listen(3000, () => {
    console.log('Express Spotify Searcher listening on port 3000!');
});
