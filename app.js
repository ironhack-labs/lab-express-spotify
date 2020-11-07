require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:

app.get('/', (req, res) => {
    res.render(`index`)
})

app.get('/artist-search', (req, res) => {
    const { artist } = req.query
    spotifyApi.searchArtists(artist)
        .then(function(data) {
            const artistsArray = data.body.artists.items
            res.render('artist-search-result', { artistsArray })
        }, function(err) {
            console.error(err)
        })
})

app.get('/albums/:artistId', (req, res) => {
    const { artistId } = req.params
    spotifyApi.getArtistAlbums(artistId).then(
        function(data) {
            const album = data.body.items
            res.render('albums', { album })
        },
        function(err) {
            console.error(err);
        }
    );

})

app.get('/tracks/:albumId', (req, res) => {
    const { albumId } = req.params
    spotifyApi.getAlbumTracks(albumId, { limit: 5, offset: 1 })
        .then(function(data) {
            const tracks = data.body.items
            res.render('tracks', { tracks })
        }, function(err) {
            console.log('Something went wrong!', err);
        });
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));