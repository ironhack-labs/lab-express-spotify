const express = require('express');
const router = express.Router();
const controller = require('../controllers/base.controller');

router.get('/', controller.base);
router.get('/artists',controller.getArtists)
router.get('/albums/:artistId',controller.getArtistAlbums)
router.get('/tracks/:albumId',controller.getAlbumTracks)

module.exports = router;