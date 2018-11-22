var express = require('express');
var router = express.Router();

var spotifyApi = require(__dirname + '/../models/spotifyAPI')

router.get('/:albumId', function(req,res){
  var albusId = req.params.albumId
  spotifyApi.getAlbumTracks(albusId, { country: 'NL'})
  .then(data => {
    res.render("tracks", {track: data.body.items});
    })
  .catch(err => {
    console.log("Error: " + err);
  })
})


module.exports = router;