require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// Require spotify-web-api-node package
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Setting Spotify API
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Get Home
app.get('/', (req, res, next) => {
    res.render('home');
});

// Get Artists
app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const artistInfo = data.body.artists.items;
            res.render('artist-search-results', {
                artists: artistInfo
            });
        })
        .catch(error => console.log('This error while searching artists occurred: ', error));
});

// Get Albums
app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            const albumInfo = data.body.items;
            res.render('albums', {
                albums: albumInfo
            });
        })
        .catch(error => console.log('This error while searching albums occurred: ', error));
});

// Get Tracks
app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;

    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            const trackInfo = data.body.items;
            res.render('tracks', {
                tracks: trackInfo
            });
        })
        .catch(error => console.log('This error while searching tracks occurred: ', error));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));