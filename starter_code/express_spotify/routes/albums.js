const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser'); 


var urlcodeParser = bodyParser.urlencoded({ extended: false});
var spotifyApi = require(__dirname + '/../models/spotify_api');

router.get('/:artistId', function(req, res) {
    let artistId = req.params.artistId;
    spotifyApi.getArtistAlbums(artistId)
    .then(
      function(data) {
        res.render('albums', {result: data.body.items}) 
      },
    function(err) {
      console.error(err);
    }
    );  
})

module.exports = router;