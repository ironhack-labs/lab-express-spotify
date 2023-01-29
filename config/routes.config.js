const express = require('express');
const router = express.Router();

const spotify = require('../controllers/spotify.controller');

router.get('/', spotify.home);
router.get('/artists', spotify.searchArtist)
router.get('/albums/:artistId', spotify.getAlbums)
router.get('/tracks/:albumId', spotify.getTracks)

module.exports = router;