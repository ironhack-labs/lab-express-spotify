const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotify.controller')

router.get('/', spotifyController.index)
router.post('/artists', spotifyController.artist)
router.get('/albums/:artistId', spotifyController.albums)
router.get('/:artistId/tracks', spotifyController.tracks)


module.exports = router;