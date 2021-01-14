const express = require('express');
const common = require('../controllers/common.controller');
const router = express.Router();

router.get('/', common.home);
router.get('/artist-search', common.search);
router.get('/albums/:id', common.showAlbums);
router.get('/tracks/:id', common.showTracks);

module.exports = router;