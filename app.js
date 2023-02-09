require('dotenv').config();


const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {
    const { artist } = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            const artists = data.body.artists.items
            res.render('search-result', { artists })
        })
        .catch(err => console.log(err))
})

app.get('/albums/:artistID', (req, res) => {
    const { artistID } = req.params

    spotifyApi
        .getArtistAlbums(artistID)
        .then(data => {
            const albums = data.body.items
            res.render('albums', { albums })
        })
        .catch(err => console.log(err))
})

app.get('/tracks/:albumID', (req, res) => {
    const { albumID } = req.params

    spotifyApi
        .getAlbumTracks(albumID)
        .then(data => {
            const track = data.body.items
            res.render('tracks', { track })
        })
        .catch(err => console.log(err))
})


app.listen(5005, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
