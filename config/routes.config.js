const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home.controller');
const searchController = require('../controllers/search.controller');
const albumsController = require('../controllers/albums.controller');
const tracksController = require('../controllers/tracks.controller');


router.get('/', homeController.home);
router.get('/search', searchController.search);
router.get('/albums/:id', albumsController.albums);
router.get('/tracks/:tracksId', tracksController.tracks);


module.exports = router;