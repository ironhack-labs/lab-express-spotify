const express = require('express');
const router = express.Router();
const artistsController = require('../controllers/artists.controller')

//Home
router.get('/', artistsController.home); 
router.get('/artists', artistsController.list);
router.get('/albums/:artistId', artistsController.albums);
router.get('/tracks/:tracksId', artistsController.tracks);

module.exports = router;




//DUDAS

//qué hace exactamente router y express.router¿?
//si fuera artists/albums?... hay que poner algo más?