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

app.get('/', (req, res) => {
    res.render('index-page')
})

app.get('/artist-search', (req, res) => {
    const { artist } = req.query
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            //console.log('The received data from the API: ', data.body.artists.items[0].images)
            res.render('artist-search', { artists: data.body.artists.items })
        })
        .catch(err => console.log('You have this error: ', err))
})

app.get('/albums/:album_id', (req, res) => {
    const { album_id } = req.params
    spotifyApi
        .getArtistAlbums(album_id)
        .then(data => {
            //console.log('Los albums son: ', data.body.items)
            res.render('albums', { albums: data.body.items })
        })
        .catch(err => console.log('You have this error: ', err))
})

app.get('/albums/tracks/:track_id', (req, res) => {
    const { track_id } = req.params
    spotifyApi
        .getAlbumTracks(track_id)
        .then(data => {
            //console.log('Las canciones son: ', data.body.items)
            res.render('tracks', { tracks: data.body.items })
        })
        .catch(err => console.log('You have this error: ', err))
})

app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
