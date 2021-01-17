const express = require('express');
const router = express.Router();
const artistsController = require('../controllers/artists.controller')

router.get('/', artistsController.home);
router.get('/artists-search', artistsController.search)
router.get('/albums/:id', artistsController.albums)
router.get('/albums/:id/tracks', artistsController.tracks)

module.exports = router;