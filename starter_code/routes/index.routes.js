const express = require('express');
const router = express.Router();
//const home = require('../models/index.js');

router.get('/', (req, res, next) => {
    res.render('index');
  });

module.exports = router;