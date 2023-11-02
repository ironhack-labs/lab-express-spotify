require('dotenv').config();

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
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))

app.get("/", (req, res) => {
    res.render("index")
})
    
app.get("/artist-search", (req, res) => {
    console.log(req.query)
    const { artist } = req.query
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items)
            res.render("artist-search-results", { artists: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get("/albums/:artistId", (req, res) => {
    const { artistId } = req.params
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            console.log('The received data from the API: ', data.body.items)
            res.render("albums", { albums: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get("/albums/tracks/:albumId", (req, res) => {
    const { albumId } = req.params
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            console.log('The received data from the API: ', data.body.items)
            res.render("tracks", { tracks: data.body.items })
        })
})

app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'))
