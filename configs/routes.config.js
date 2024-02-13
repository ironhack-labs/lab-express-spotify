const express = require('express');

// Poner aquí todos los controladores
const spotify = require('../controller/spotify.controller');
const index = require('../controller/index.controller');

const router = express.Router();

// Poner aquí todos los router.get()
router.get('/', index.index);
router.get('/artist-search', spotify.searchArtist);
router.get('/albums/:id', spotify.albums);
router.get('/albums/:id/tracks', spotify.tracks);



module.exports = router;