const PORT = 3000;
const dotenv = require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const path = require('path');
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


app.get(`/`, (req, res) => {
    res.render(`index`)
})

app.get(`/artist-search`, (req, res, next) => {
    spotifyApi
        .searchArtists((req.query).artist)
        .then(data => {
            res.render(`artist-search-results`, {
                data
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:artistID', (req, res, next) => {
    spotifyApi.getArtistAlbums((req.params).artistID)
        .then(data => {
            res.render(`albums`, {
                data
            })
        })
})

app.get('/view-tracks/:album', (req, res, next) => {
    spotifyApi.getAlbumTracks((req.params).album)
        .then(data => {
            res.render(`view-tracks`, {
                data
            })
        })
})

app.get('/top-tracks/:artistID', (req, res, next) => {
    spotifyApi.getArtistTopTracks((req.params).artistID, "NL")
        .then(data => {
            console.log(data)
            res.render(`top-tracks`, {
                data
            })
        })
})




app.listen(PORT, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));