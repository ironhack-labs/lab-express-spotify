require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(listArtist => {
            console.log('The received data from the API: ', listArtist.body.artists.items);
            res.render('artist-search-results', { listArtist })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(album => {
            console.log('Artist albums', album.body);
            res.render('albums', { album })
        })
        .catch(err => console.log('The error while searching album occurred: ', err));
});

app.get('/albums/:albumId/tracks', (req, res) => {
    console.log(req.params.albumId)
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(tracks => {
            console.log('Tracks', tracks.body);
            res.render('tracks', { tracks })
        })
        .catch(err => console.log('Something went wrong!', err));
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
