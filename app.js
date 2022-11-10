require('dotenv').config();


const express = require('express');
const hbs = require('hbs');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res) => {
    res.render('index-page')
})

app.get("/artist-search", (req, res) => {

    const { artist } = req.query
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items)
            const groups = data.body.artists.items
            res.render('artist-search-results', { groups })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))


    //console.log('Este es el objeto de Query Strings:', req.query)
})
app.get("/album-page/:album", (req, res) => {

    const artistAlbum = req.params.album
    spotifyApi
        .getArtistAlbums(artistAlbum)
        .then(data => {
            console.log('The received data from the API: ', data.body.items)
            const albums = data.body.items
            res.render('album-page', { albums })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})
app.get("/songs-page/:artistId", (req, res) => {

    const artistId = req.params.artistId
    spotifyApi
        .getAlbumTracks(artistId)
        .then(data => {
            console.log('The received data from the API: ', data.body.items)

            res.render('songs-page', { tracks: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'));
