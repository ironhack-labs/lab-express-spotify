const express = require('express');

const misc = require('../controllers/misc.controller');
const router = express.Router();

router.get('/', misc.home);

module.exports = router;
