const express = require('express');
const misc = require('../controllers/misc.controller');
const artistController = require('../controllers/artist.controller');
const albumController = require('../controllers/album.controller');
const tracksController = require('../controllers/track.controller');

const router = express.Router();

router.get('/tracks/:albumId', tracksController.tracks);
router.get('/albums/:artistId', albumController.albums);
router.get('/artist-search', artistController.artist);
router.get('/', misc.home);

module.exports = router;