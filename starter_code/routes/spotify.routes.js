const express = require('express');
const router = express.Router();

const spotifyController = require('../controllers/spotify.controller');

router.get('/', spotifyController.main);
router.get('/artist', spotifyController.list);
router.get('/albums/:id', spotifyController.albums);
router.get('/tracks/:id', spotifyController.tracks);


module.exports = router;