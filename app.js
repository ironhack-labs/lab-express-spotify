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

// Recupera un token di accesso 
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Qualcosa è andato storto durante il recupero di un token di accesso', errore));
// Our routes go here:
app.get('/', (req, res) => {
    res.render('homePage')
})

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            // console.log('The recived data from the API: ', data.body)
            // console.log(data.body.artists.items)
            res.render('artist', { artists: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:artistId', (req, res, next) => {
    console.log('TEST: ', req.params.artistId)
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(album => {
            res.render('albums', { albums: album.body.items })
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/tracks/:trackId', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.trackId)
        .then(track => {
            res.render('tracks', { tracks: track.body.items })
        })
        .catch(err => console.log('The error while searching tracks occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));