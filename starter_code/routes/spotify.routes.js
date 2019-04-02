const express = require('express');
const router = express.Router();

const spotifyController = require('../controllers/spotify.controller');

router.get('/', spotifyController.main);
router.get('/artist', spotifyController.detail);

module.exports = router;