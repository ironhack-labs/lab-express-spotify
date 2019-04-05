const express = require('express');
const router = express.Router();
const albumController =  require('../controller/album.controller');

router.get('/', albumController.list);
// router.get('/:id', artistController.details);

module.exports = router;