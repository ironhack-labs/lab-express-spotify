const router = require('express').Router()
const mainController = require('../controllers/main.controller');


//home
router.get('/', mainController.renderHome);

//artists
router.get('/artist-search', mainController.getArtistsSearch);

//albums
router.get('/albums/:artistId', mainController.getAlbums);

// tracks
router.get('/albums/:albumId/tracks', mainController.getAlbumTracks);

module.exports = router;