// Load env vars
require('dotenv').config({ path: './config/config.env' });

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Spotify credentials
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
    .catch((error) =>
        console.log(
            'Something went wrong when retrieving an access token',
            error
        )
    );

// ROUTES
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.search)
        .then((artists) => {
            res.render('artist-search-results', {
                artists: artists.body.artists.items,
            });
        })
        .catch((err) => console.log(err));
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId).then((albums) => {
        res.render('albums', { albums: albums.body.items });
    });
});

app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId).then((tracks) => {
        console.log('tracks', tracks.body);
    });
});
const PORT = 3609;
app.listen(PORT, () =>
    console.log(`My Spotify project running on port: ${PORT}`)
);
