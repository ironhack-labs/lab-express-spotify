const express = require("express");
const router = express.Router();

const {
    landing, 
    artist,
    album,
    tracks
  } = require("../controllers/index.controllers");

router.get('/', landing)
router.get('/artist', artist)
router.get('/albums/:id', album)
router.get('/tracks/:id', tracks)

module.exports = router;