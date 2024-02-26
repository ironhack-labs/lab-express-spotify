const express = require('express');     
const router = express.Router();
const spotify = require('../controllers/spotify.controller')

router.get('/', spotify.home)
router.get('/artist-search', spotify.list)
router.get('/albums/:id', spotify.showAlbums)
router.get('/albums/:id/tracks', spotify.showTracks)


module.exports = router;