const express = require('express');
const router = express.Router();

const artistController = require('../controllers/artists.controller');
const commonController = require('../controllers/common.controller');
const albumsController = require('../controllers/albums.controller');
const tracksController = require('../controllers/tracks.controller');

router.get('/', commonController.home);
router.get('/artist-search', artistController.list);
router.get('/albums/:id', albumsController.list);
router.get('/album/:id/tracks', tracksController.list);

module.exports = router;