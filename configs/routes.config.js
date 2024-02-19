const express = require('express');
const misc = require('../controllers/misc.controller');
const artists = require('../controllers/artists.controller');
const albums = require('../controllers/albums.controller');
const tracks = require('../controllers/tracks.controller');

const router = express.Router();

router.get('/', misc.home);
router.get('/artist-search', artists.list);
router.get('/albums/:id', albums.list);
router.get('/tracks/:id', tracks.list);

module.exports = router;