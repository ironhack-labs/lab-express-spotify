var express = require('express');
var router = express.Router();
const spotifyApi = require('./spotifyWebApi')

router.get('/tracks/:albumId', (req, res) => {
    // console.log("For the tracks", req.params.albumId)
    spotifyApi.getAlbumTracks(req.params.albumId, { limit : 5, offset : 1 })
    .then(function(data) {
      console.log(data.body.items[0]);
      res.render('tracks', {track: data.body.items})
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});

module.exports = router;