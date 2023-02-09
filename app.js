require('dotenv').config()

const express = require('express')
const hbs = require('hbs')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

const PORT = 5005

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
    .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {
    const { artist } = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            const { items: artists } = data.body.artists
            res.render('artist-search-results', { artists })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            const albums = data.body.items
            res.render('albums', { albums })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/tracks/:trackId', (req, res, next) => {
    const { trackId } = req.params
    spotifyApi
        .getAlbumTracks(trackId)
        .then(data => {
            const track = data.body.items
            res.render('tracks', { track })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.listen(PORT, () => console.log('Server running on port 5005'))
