const express = require('express');
const home = require('../controllers/home.controller');
const artist = require('../controllers/artist.controller');

const router = express.Router();

router.get('/', home.search);
router.get('/artists-search', artist.artistController);

module.exports = router;