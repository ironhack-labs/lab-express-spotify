const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('home');
});

// /* GET artists page */
// router.get('/artists', (req, res, next) => {
//     res.render('artists');
//   });

module.exports = router;