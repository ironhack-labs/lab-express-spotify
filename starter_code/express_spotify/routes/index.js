const express = require('express');
const router = express.Router();

var spotifyApi = require(__dirname + '/../models/spotify_api');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.post('/artists', function(req, res){
//   res.redirect(`/artists?q=${req.body.searchQuery}`)
// });

module.exports = router;
