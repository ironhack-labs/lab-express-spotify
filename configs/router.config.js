const express = require('express');
const router = express.Router();

const spotifyController = require('../controllers/spotify.controller');

router.get('/', spotifyController.home)
router.get('/artist-search', spotifyController.searchArtist)
router.get('/albums/:artistId', spotifyController.getAlbums)
router.get('/:id/tracks', spotifyController.searchTracks)

module.exports = router;