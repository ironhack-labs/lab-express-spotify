const express = require('express');

const homeController = require('../controllers/home.controller')
const artistSearchController = require('../controllers/artist.controller')
const albumSearch = require('../controllers/albums.controller')
const trackSearch = require('../controllers/track.controller')

const router = express.Router()

router.get('/', homeController.home)
router.get('/artist-search', artistSearchController.artist)
router.get('/albums/:artistId', albumSearch.albums)
router.get('/albums/:albumId/tracks', trackSearch.tracks)

module.exports = router