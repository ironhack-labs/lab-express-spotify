
const express = require('express');
const spotifyController = require('../controllers/spotify.controller');
const router = express.Router();

router.get('/', spotifyController.home)
router.get('/artist-search', spotifyController.searchArtist)
router.get('/:id/tracks', spotifyController.searchTracks)
router.get('/albums/:artistId', spotifyController.getAlbum)



module.exports = router;