const express = require('express')
const router = express.Router()
const spotifyApi = require('../configs/api.config')

// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            // data.body.artists.items.forEach(elm => console.log('The received data from the API: ', elm.images[0].url))
            
            res.render('artist-search-results', {data: data.body})
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

router.get('/albums/:artistId', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            // data.body.items.forEach(elm => console.log('The received data from the API: ', elm.artists[0].name))
            res.render('albums', { data: data.body })
        // .then(() => res.render('albums',req.params.artistName))
        .catch(err => console.log('The error while searching artists occurred: ', err));

        })
})

router.get('/tracks/:albumId', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            res.render('tracks', { data: data.body })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    })
})


module.exports = router
