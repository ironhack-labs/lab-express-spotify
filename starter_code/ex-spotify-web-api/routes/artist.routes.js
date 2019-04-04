const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist.controller')

router.get('/',artistController.list);
router.get('/albums/:id',artistController.albums)
router.get('/albums/tracks/:id',artistController.tracks)

module.exports = router;