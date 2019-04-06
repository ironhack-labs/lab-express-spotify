const express = require('express');
const router = express.Router();
const tracksController = require('../controllers/tracks.controller')

/* GET users listing. */
router.get('/:idAlbum', tracksController.list);

module.exports = router;
