var SpotifyWebApi = require('spotify-web-api-node')
const express = require('express')
const router = express.Router()

var clientId = '52d168fb95db4ba0bcff0805d666dde0',
    clientSecret = '96daf099aea5480eaacf953d9b604912'

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
})

spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token'])
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err)
    })


router.get('/', (req, res) => {
    const { search } = req.query
    if (search) {
        spotifyApi.searchArtists(search, { limit: 3 }).
            then(data => {
                let artistList = data.body.artists.items
                res.render('artists', { artistList })
            })
    } else {
        res.render('home')
    }
})

router.get('/albums/:id', (req, res) => {
    const { id } = req.params
    spotifyApi.getArtistAlbums(id)
        .then(data => {
            let albums = data.body.items
            console.log(albums)
            res.render('albums', { albums })
        }).catch(err => {
            console.log(err)
        })
})


router.get('/tracks/:id', (req, res) => {
    const { id } = req.params
    spotifyApi.getAlbumTracks(id)
        .then(data => {
            let tracks = data.body.items

            res.render('tracks', { tracks })
        }).catch(err => {
            console.log(err)
        })
})


module.exports = router