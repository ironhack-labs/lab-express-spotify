const express = require('express');
const router = express.Router();
const spotify = require('../controllers/spotify.controller');

router.get("/", spotify.home);
router.get("/artist-search", spotify.artists);
router.get("/albums/:id", spotify.albums);
router.get("/albums/:id/tracks", spotify.tracks);

module.exports = router;
