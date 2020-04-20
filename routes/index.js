const express = require('express');
const router = express.Router();

// home
router.get('/', (req, res) => {
  res.render('index.hbs');
});

module.exports = router;
