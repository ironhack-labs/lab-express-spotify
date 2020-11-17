require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artist-search', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
        // console.log('The received data from the API: ', data.body);
        let artists = data.body.artists.items;
        console.log('The received artists from the API: ', artists);
        res.render('artist-search-results', {artists});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
        let albums = data.body.items;
        console.log(albums);
        res.render('albums', {albums})
    })
    .catch(err => console.log('The error while displaying artists albums occurred: ', err));
});

app.get('/albums/:albumId/tracks', (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
        let tracks = data.body.items;
        console.log(tracks);
        res.render('tracks', {tracks})
    })
    .catch(err => console.log('The error while displaying tracks occurred: ', err));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
