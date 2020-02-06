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

// Recuperate token de access
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log(' Algo salió mal al recuperar un token de acceso ', error));

// Our routes go here:

app.get('/', (req, res) => res.render('index'))

app.get('/artist-search', (req, res) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(data =>res.render('artistSearch', {result: data.body}))
        .catch(err => console.log('The error while searching artists occurred: ', err))
})
app.get('/albums/:id', (req, res) => {
    const albumId = req.params.id
    spotifyApi.getArtistAlbums(albumId)
        .then(album => res.render('albums', {infoAlbum: album.body.items}))
        .catch(err => console.log("Error consultar album en la BBDD: ", err))})

app.get('/songs/:id', (req, res) => {
    const songsId = req.params.id
    spotifyApi.getAlbumTracks(songsId)
        .then(songs =>{console.log(songs.body.items[0])
            res.render('songs', {infoSongs: songs.body.items
        })})
        .catch(err => console.log("Error consultar album en la BBDD: ", err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));