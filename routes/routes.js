const router = require('express').Router()
const mainController = require('../controllers/main.controller');

router.get('/', mainController.renderHome);

router.get('/artist-search', mainController.getArtistsSearch);

router.get('/albums/:artistId', mainController.getAlbums);

router.get('/albums/:albumId/tracks', mainController.getAlbumTracks);

module.exports = router;