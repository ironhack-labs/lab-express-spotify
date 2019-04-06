const express = require('express');
const router = express.Router();
const albumsController = require('../controllers/albums.controller')

/* GET users listing. */
router.get('/:id', albumsController.albums);

module.exports = router;
