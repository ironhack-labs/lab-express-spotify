require('dotenv').config()

const express = require('express')
const hbs = require('hbs')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/artist-search', (req, res) => {
    const { artist } = req.query
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            const artists = data.body.artists.items
            // console.log(artists)
            res.render('artist-search-results.hbs', { artists })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res) => {
    const { id } = req.params
    spotifyApi
        .getArtistAlbums(id)
        .then(data => {
            const albums = data.body.items
            // console.log(albums)
            res.render('albums', { albums })
        })
        .catch(err => console.log('The error while searching album occurred: ', err));
})

app.get('/tracks/:id', (req, res) => {
    const { id } = req.params
    spotifyApi
        .getAlbumTracks(id)
        .then(data => {
            const tracks = data.body.items
            // console.log(artists)
            res.render('tracks', { tracks, number: tracks.length })
        })
        .catch(err => console.log('The error while searching album occurred: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
