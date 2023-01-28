const express = require('express')
const router = express.Router()

const spotifyController = require('../controllers/spotify.controller')


router.get('/', spotifyController.home)

router.get('/artist-search', spotifyController.search)

router.get('/albums/:artistId', spotifyController.albums)

router.get('/tracks/:albumId', spotifyController.tracks)


module.exports = router