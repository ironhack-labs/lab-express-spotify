const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
var bodyParser = require("body-parser");

var SpotifyWebApi = require('spotify-web-api-node');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerPartials(`${__dirname}/views/partials`);

// Remember to paste your credentials here
var clientId = 'b3ca9caaae1f4fae8a3f664cde8c248b',
    clientSecret = 'd5ed6672dc2f4d59ada42d6a7781270a';

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
    res.render('home')
});

app.get('/artists', (req, res) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            let artists = data.body.artists.items;
            //console.log(artists);
            res.render('artists', {artists})
        })
        .catch(err => {
            console.log(err);
        })
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            let albums = data.body.items;
            //console.log(albums);
            res.render('albums', {albums})
        })
        .catch(err => {
            console.log(err);
        })
});

app.get('/tracks/:trackId', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.trackId)
        .then(data => {
            let tracks = data.body.items;
            console.log(tracks);
            res.render('tracks', {tracks})
        })
        .catch(err => {
            console.log(err);
        })
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))