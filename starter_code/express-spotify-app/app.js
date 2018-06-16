const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const hbs = require('hbs');
const index = require('./routes/index');
const path    = require('path');

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(__dirname + '/views/partials/artistPartial.hbs');

const clientId = '8a5b3c7007c54ae5817cec2ffc6c919a',
    clientSecret = '8f832383aebe47dca45f4fa4f3b41f9a';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieves an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body.access_token);
    }, err => {
        console.log('You got wrecked while retrieving an access token', err);
    }
);

app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artists', (req, res, next) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            const artists = data.body.artists/* .items */;
            artists.items.forEach(e => console.log(e));
            res.render('artists', artists);
        })
        .catch(err => {
            console.log('You\'ve received an error: ', err);
        });
});

app.get('/albums', (req, res) => {
    spotifyApi.getArtistAlbums(req.query.artistId)
        .then(data => {
            const albums = data.body;
            albums.items.forEach(e => console.log(e));
            res.render('albums', albums);
        })
        .catch(err => {
            console.log('An error has wrecked you: ', err);
        });
});

app.get('/tracks', (req, res) => {
    spotifyApi.getAlbumTracks(req.query.albumId)
        .then(data => {
            const tracks = data.body;
            tracks.items.forEach(e => console.log(e));
            res.render('tracks', tracks);
        })
        .catch(err => {
            console.log('You got this far and got wrecked by ', err);
        });
});

app.listen(3000);