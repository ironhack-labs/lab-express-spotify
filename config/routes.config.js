const express = require('express');
const router = express.Router();

const commons = require('../controllers/common.controller');
const artist = require('../controllers/artist.controller')

router.get('/home', commons.home);

router.get('/artist-search', artist.search  )

router.get('/albums/:artistId', artist.album )

router.get('/tracklist/:albumId', artist.tracklist)



module.exports = router