require('dotenv').config();

const express = require('express');
const { registerPartial } = require('hbs');
const hbs = require('hbs');

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

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log(error));

// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('home')
})

app.get('/artist-search', async(req, res, next) => {
    const data = req.query.artist
    const datosApiRespuesta = await spotifyApi.searchArtists(data).catch(err => console.log(err))
    console.log(datosApiRespuesta.body.artists.items)
    res.render('artistsearchresults', datosApiRespuesta.body.artists.items)
})

app.get('/tracks/:id', async(req, res, next) => {
    const { id } = req.params
    const canciones = await spotifyApi.getAlbumTracks(id).catch(err => console.log(err))
    console.log(canciones)
})





app.listen(3000, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));