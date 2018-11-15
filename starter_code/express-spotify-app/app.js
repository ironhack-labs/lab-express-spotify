const path = require('path');

const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');


var SpotifyWebApi = require('spotify-web-api-node');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials')

// Remember to paste your credentials here
var clientId = 'c987df232b6949a084d033b6bdde9e4f',
    clientSecret = '10f5875eeb4c44b6837c8f925af42c2a';

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

app.get('/', function (req, res) {
    res.render('index')
});

app.get('/artists', function (req, res) {
    // console.log(req.query.artist)

    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            // console.log(data.body.artists.items[0].external_urls);
            // console.log(data.body.artists.items[0].images);
            // console.log(data.body.artists.items);

            res.render('artists', { artist: data.body.artists.items })
        })
        .catch(err => {
            console.log('API Call Error');
        })
    // res.send('<h1>Welcome Ironhacker. :)</h1>');
});

app.get('/albums/:artistId', function (req, res) {
    console.log('Entra\n' + req.params.artistId);

    spotifyApi.getArtistAlbums(req.params.artistId)
        .then((data) => {
            console.log('Entra tb');
            console.log(data.body.items[0]);
            res.render('albums', { album: data.body.items });
        })
        .catch(() => {
            console.log('Error while loading albums.');
        })
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))