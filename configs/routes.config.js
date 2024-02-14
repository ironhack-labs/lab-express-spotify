const express = require('express');
const misc = require('../controllers/misc.controller');
const artistsController = require('../controllers/artists.controller');
const albumsController = require('../controllers/albums.controller');
const router = express.Router();


router.get('/', misc.home);
router.get('/artists-search', artistsController.artists);
router.get('/albums', albumsController.albums);

module.exports = router;