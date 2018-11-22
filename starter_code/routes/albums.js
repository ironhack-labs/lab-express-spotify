var express = require('express');
var router = express.Router();


var spotifyApi = require(__dirname + '/../models/spotifyAPI')

router.get('/:artistId', function(req,res){
  let artisId = req.params.artistId;
  spotifyApi.getArtistAlbums(artisId)
  .then((data) => {
    res.render("albums", {info: data.body.items});
  },(err) =>{
  })
})

module.exports = router;
