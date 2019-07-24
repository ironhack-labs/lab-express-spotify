const express = require('express');
const router = express.Router();
const spotifyApi = require('../spotifyApi');

router.get("/:albumId", (req, res, next)=> {
  spotifyApi.getAlbumTracks(req.params.albumId, 
  { limit : 5, offset : 1})
  .then(function(data) {
    const tracks = data.body.items;
    res.render("tracks", {tracks}), 
    function(err) {
    console.log('Something went wrong!', err);
    }
  });
});

module.exports = router;