const express = require('express');
const router = express.Router();
const albumController =  require('../controller/album.controller');

router.get('/:id', albumController.details);

module.exports = router;