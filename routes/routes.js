const router = require('express').Router();
const mainController = require('../controllers/main.controller');


// Home
router.get('/', mainController.renderHome);

// Artist
router.get('/artist-search', mainController.searchArtist);

//Albums
router.get('/albums/:artistId', mainController.getAlbums)

//Album Tracks
router.get('/albums/:albumId/tracks', mainController.getAlbumTracks)
module.exports = router;