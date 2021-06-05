const express = require('express')
const common = require('../controllers/common.controller')
const spotify = require('../controllers/spotify.controller')

const router = express.Router()

router.get('/home', common.home)
router.get('/artist-search', spotify.artistSearch )
router.get('/albums/:artistId', spotify.getArtistAlbums )
router.get('/tracks/:albumsId', spotify.getAlbumTrack)

module.exports = router