const express = require('express');
const router = express.Router();
const artistController =  require('../controller/artist.controller');

router.get('/', artistController.list);
// router.get('/:id', artistController.details);

module.exports = router;