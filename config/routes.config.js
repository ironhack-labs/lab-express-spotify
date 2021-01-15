const express = require('express');
const router = express.Router();
const artistsController = require('../controllers/artists.controller')

router.get('/', artistsController.home);
router.get('/artists-search', artistsController.search)

module.exports = router;