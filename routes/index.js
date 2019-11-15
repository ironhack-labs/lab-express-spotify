const express = require('express');
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



module.exports = router;
