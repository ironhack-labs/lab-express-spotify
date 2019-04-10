const express = require('express');
const router = express.Router();
const spotifyApi= require('../config/spoti.config')
const app = express();
 

router.get('/', (req, res, next) => {

  spotifyApi.searchArtists(req.query.artist)
  .then(function(data) {
    console.log('Search artists by param:');
  }, function(err) {
    console.error(err);
  });
});




module.exports = router;
