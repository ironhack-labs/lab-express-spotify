const express = require('express');

const homeController = require('../controllers/home.controller')
const artistSearchController = require('../controllers/artist.controller')

const router = express.Router()

router.get('/artist-search', artistSearchController.artist)
router.get('/', homeController.home)

module.exports = router