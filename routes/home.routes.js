require('dotenv').config();
const express = require('express')
const router = express.Router()

const SpotifyWebApi = require('spotify-web-api-node')
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))


router.get('/', (req, res) => {
    res.render('home')
})

router.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const { items } = data.body.artists
            console.log(items)
            res.render('artist-search', { items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

router.get('/albums/:artistId', (req, res) => {
    const { artistId } = req.params
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            const { items } = data.body
            console.log(items);
            res.render('albums', { items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

module.exports = router