require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

// Configure hbs
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')

// setting spotify-api
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
app.get('/', (req, res, next) => {
    res.render('home', { title: 'Spotify api' })
})

app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            res.render('artists', { artists: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            res.render('albums', { albums: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:id', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(data => {
            res.render('tracks', { tracks: data.body.items })
            console.log(data.body.items)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


const PORT = process.env.PORT
app.listen(PORT, () => console.log(`My Spotify project running on port ${PORT} 🎧 🥁 🎸 🔊`));
