const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

//-- Spotify params
var SpotifyWebApi = require('spotify-web-api-node');
var clientId = '07c07898a3754fabb9e2847628610255',
    clientSecret = 'c1340b44b5894148b1d55b9f88a2cb68';
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


app.get('/', function(req, res) {
    res.render('index');
});

app.get('/artists', function(req, res) {
    console.log('req', req.query);
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            console.log('data', data.body.artists.items);
            let artistsList = data.body.artists.items;
            res.render('artists', { artistsList })
        })
        .catch(err => {
            console.log(err);
            res.render('artists', { artistsList: [], err })
        })
});

app.get('/albums/:artistId', (req, res) => {
    let ID = req.params.artistId;

    spotifyApi.getArtistAlbums(ID)
        .then(data => {
            console.log('albumsList', data.body.items)
            let albumsList = data.body.items;
            res.render('albums', { albumsList });
        })
        .catch(err => {
            res.render('albums', { albumsList: [], err })
        })
});

app.get('/tracks/:albumId', (req, res) => {
    let ID = req.params.albumId;
    spotifyApi.getAlbumTracks(ID)
        .then(data => {
            console.log('tracksList', data.body);
            let tracksList = data.body.items;
            res.render('tracks', { tracksList });
        })
        .catch(err => {
            res.render('tracks', { tracksList: [], err })
        });
})

app.listen(3005, () => console.log('Example app listening on port 3005!'))