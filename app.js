require('dotenv').config()

const express = require('express')
const hbs = require('hbs')
const chalk = require('chalk')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')


const app = express()

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// Handlebars' partials location:
hbs.registerPartials(__dirname + '/views/partials')

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:
app.get('/', (req, res) => {
    res.render('home.hbs')
})

app.get('/artist-search/:name', async (req, res) => {
    try {
        const name = req.params.name
        const artists = await (await spotifyApi.searchArtists(name)).body.artists.items //Returns artists w matching names in []
        res.render('searchResults.hbs', { name, artists })
    }
    catch (err) {
        console.log(chalk.bgRed('Error:', err))
    }
})

app.get('/albums/:id', async (req, res) => {
    try {
        const name = await (await spotifyApi.getArtist(req.params.id)).body.name
        const albums = await (await spotifyApi.getArtistAlbums(req.params.id)).body.items
        res.render('albums.hbs', { name, albums })
    }
    catch (err) {
        console.log(chalk.bgRed('Error:', err))
    }
})

app.get('/album/:id/tracks', async (req, res) => {
    try {
        const album = await (await spotifyApi.getAlbum(req.params.id)).body.name
        const tracks = await (await spotifyApi.getAlbumTracks(req.params.id)).body.items
        res.render('albumTracks.hbs', { album, tracks })
    }
    catch (err) {
        console.log(chalk.bgRed('Error:', err))
    }
})

app.listen(3000, () => console.log(chalk.bgGreen('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')))
