const express = require('express');
const misc = require('../controllers/misc.controller');
const artistController = require('../controllers/artist.controller');
const router = express.Router();


router.get('/artist-search', artistController.artist);
router.get('/', misc.home);

module.exports = router;