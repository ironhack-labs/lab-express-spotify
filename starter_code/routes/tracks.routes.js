const express = require('express');
const router = express.Router();
const tracksController =  require('../controller/tracks.controller');

router.get('/:id', tracksController.list);
// router.get('/:id', artistController.details);

module.exports = router;