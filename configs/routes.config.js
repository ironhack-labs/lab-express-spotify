const express = require('express');
const spoty = require('../controllers/spoty.controllers')
const router = express.Router();

router.get('/', spoty.home)

router.get('/artist-search', spoty.search)

router.get('/albums/:artistId', spoty.album)

router.get('/tracks/:albumId', spoty.tracks)

module.exports = router;