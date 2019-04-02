const express = require('express');
const router = express.Router();

//Home
router.get('/', function(req, res, next) {
  res.render('../views/index')
})
//router.get('/artists', function(req,res,next) {
//  res.render('../views/artists', req.query)
//})

module.exports = router;