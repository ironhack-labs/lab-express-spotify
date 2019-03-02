var express = require('express');
var router = express.Router();
const spotifyApi = require('./spotifyWebApi')

router.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId).then(
        function(data) {
        //   console.log('Artist albums', data.body.items);
        //   console.log(data.body.items.images);
          res.render('albums', {album: data.body.items})
        },
        function(err) {
          console.error(err);
        }
    );
});

module.exports = router;