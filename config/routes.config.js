const express = require('express');
const home = require('../controllers/home.controller');
const artist = require('../controllers/artist.controller');
const albums = require('../controllers/albums.controller');

const router = express.Router();

router.get('/', home.search);
router.get('/artists-search', artist.artistController);
router.get('/albums/:id', albums.list);

module.exports = router;