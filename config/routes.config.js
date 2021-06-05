const express = require('express');

const common = require('../controllers/common.controller')
const artists = require('../controllers/artists.controller')
const albums = require('../controllers/albums.controller')
const tracks = require('../controllers/tracks.controller')

const router = express.Router();

router.get('/', common.home)
router.get('/artist-search', artists.doSearch)
router.get('/albums',albums.albums)
router.get('/albums/:id', albums.getAlbums)
router.get('/tracks', tracks.tracks)
router.get('/tracks/:albumid')
module.exports = router;