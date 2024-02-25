const express = require('express');     
const router = express.Router();
const spotify = require('../controllers/spotify.controller')

router.get('/', spotify.home)
router.get('/artist-search', spotify.list)


module.exports = router;