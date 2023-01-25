const express = require('express');
const router = express.Router();
const spotify = require('../controllers/spotify.controller')

router.get('/', spotify.home)
router.get('/artist-search', spotify.artist)
router.get('/albums/:artistId', spotify.albums)
router.get('/tracks/:albumId', spotify.tracks)

module.exports = router