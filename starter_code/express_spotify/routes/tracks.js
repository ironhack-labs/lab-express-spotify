const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser'); 

var urlcodeParser = bodyParser.urlencoded({ extended: false});
var spotifyApi = require(__dirname + '/../models/spotify_api');

router.get('/:albumId', function(req, res) {
    let albumId = req.params.albumId;
    spotifyApi.getAlbumTracks(albumId)
    .then(function(data) {
        console.log(data.body.items);
        res.render('tracks', {result: data.body.items})
    }, function(err) {
      console.log('Something went wrong!', err);
    }); 
})

module.exports = router;