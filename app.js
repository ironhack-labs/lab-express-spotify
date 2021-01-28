const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');
//require('dotenv').config();

const app = express();

// require spotify-web-api-node package here:

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: '3',
    clientSecret: '9'
});

// setting the spotify-api goes here:

spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token'])
    })
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/artist-search', (req, res) => {
    //console.log(req.query.search)
    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            //  console.log('Artist from the database', data.body.artists.items[2])
            res.render('artist-search-results', { artistsSearch: data.body.artists.items })
        })
        .catch(error => console.log(error));
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            // console.log('Albums information', data.body);
            res.render('albums', { albums: data.body.items })
        })
        .catch(error => console.log(error));
});

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 })
        .then(data => {
            console.log('tracks information', data.body);
            res.render('tracks', { tracks: data.body.items })
        })
        .catch(error => console.log(error));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));