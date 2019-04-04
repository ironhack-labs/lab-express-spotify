const express = require('express');
const router = express.Router();
const artistsController = require('../controllers/artists.controller')

//Home
router.get('/', artistsController.home); 
router.get('/artists', artistsController.list);

module.exports = router;