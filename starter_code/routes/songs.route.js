const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songs.controller')

/* GET users listing. */
router.get('/', songsController.list);
router.get('/:id', songsController.list);

module.exports = router;
