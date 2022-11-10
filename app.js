require('dotenv').config();

const { Router } = require('express');
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
//router de homepage
app.get('/', (req, res) => {
    res.render('index')
})

//router de result page
app.get('/artist-search', (req, res) => {
    const { artist } = req.query
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log("FUNCIONAAAAA", data.body.artists.items.images)

            res.render('artist-search-results', { artists: data.body.artists.items })

        })
        .catch(err => console.log('ERORRR', err));
})


//router de albums
app.get('/albums/:id', (req, res) => {
    const { id } = req.params
    spotifyApi
        .getArtistAlbums(id)
        .then(albums => {
            console.log("album: albums.body.items")
            res.render('albums', { albums: albums.body.items })
        })
        .catch(err => console.log('ERORRR', err));

})






app.listen(3000, () => console.log('My Spotify project running on port3000 🎧 🥁 🎸 🔊'));
