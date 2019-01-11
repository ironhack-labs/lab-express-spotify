const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/artist', (req, res, next) => {
  res.render('index');
});

router.get('/music', (req, res, next) => {
  res.render('music');
});

module.exports = router;
