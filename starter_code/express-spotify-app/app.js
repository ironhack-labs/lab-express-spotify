//init
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const bodyParser = require('body-parser');
app.use(morgan(`Request Method: :method, Request URL: :url, Response Time: :response-time(ms)`));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));
app.use(expressLayouts);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
//spotify API
var SpotifyWebApi = require('spotify-web-api-node');
var clientId = 'a82a3712c00a47d787ca446704ce2c50',
    clientSecret = '61847177097e4df4a33b181f896a1f21';
var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });
//routes
app.get('/', (req, res, next) => {
    res.render('index');
});
//artists
app.get('/artists', (req, res, next) => {
    let artistQuery = req.query.artist;
    spotifyApi.searchArtists(artistQuery)
        .then(function (data) {
            res.render('artists', {
                artists: data.body.artists.items
            });
        }, function (err) {
            console.error(err);
        });
});

//artist
app.get('/artist/:id', (req, res) => {
    let artistAlbumId = req.params.id;
    spotifyApi.getArtistAlbums(artistAlbumId)
        .then(function (data) {
            let artistData = data.body.items;
            res.render('album', {
                album: artistData
            });
        }, function (err) {
            console.error(err);
        });
});

//tracks
app.get('/tracks/:id', (req, res) => {
    spotifyApi.getAlbums([req.params.id])
        .then(function (albumData) {
            console.log(albumData.body.albums[0].images[0].url);
            spotifyApi.getAlbumTracks(req.params.id)
                .then(function (data) {
                    let artistTracks = data.body.items;
                    res.render('tracks', {
                        tracks: artistTracks,
                        album:albumData.body.albums[0]
                    });
                })
        })
        .catch(err => next(err));
   
});

// Server Started
app.listen(3001, () => {});