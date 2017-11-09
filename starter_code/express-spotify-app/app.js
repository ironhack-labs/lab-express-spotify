var SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

// Remember to paste here your credentials
var clientId = '1363d7290480434b89ffd445b4f023bd',
    clientSecret = 'e7e0ee999a044f3fa930d177aba4d433';

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });

app.get('/', (req, res) => {
    console.log(req);
    res.render('index');
});


app.get('/artists', (req, res) => {
    let artistSearch = req.query.artist;

    spotifyApi.searchArtists(artistSearch)
        .then(function (data) {
            let artistsArray = data.body.artists.items;
            res.render('artists', { artists: artistsArray });
        }, function (err) {
            console.error(err);
        });
});

app.get('/artists/:id', (req, res) => {
    let artistId = req.params.id;

    spotifyApi.getArtistAlbums(artistId)
        .then(function (data) {
            let artistAlbums = data.body.items;
            res.render('artist', { albums: artistAlbums });
        }, function (err) {
            console.error(err);
        });

});

app.get('/album/:id', (req, res) => {
    let albumId = req.params.id;
    spotifyApi.getAlbumTracks(albumId)
        .then(function (data) {
            res.render('tracks', { tracks: data.body.items });
        }, function (err) {
            console.error(err);
        });
});

app.listen(3000, () => {
    console.log('My first app listening on port 3000!');
});