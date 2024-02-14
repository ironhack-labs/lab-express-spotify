const express = require('express');
const home = require('../controllers/home.controller');
const artist = require('../controllers/artist.controller');
const album = require('../controllers/album.controller');
const track = require('../controllers/track.controller');

const router = express.Router();

router.get('/home', home.home);
router.get('/search', artist.search);
router.get('/albums/:artistId', album.albums);
router.get('/tracks/:albumId', track.tracks);

module.exports = router;

