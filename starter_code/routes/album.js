const express = require('express');
const router = express.Router();
const spotifyApi = require('../spotifyApi');

router.get("/:artistId", (req, res, next)=> {
    spotifyApi.getArtistAlbums(
        req.params.artistId,
        { limit: 10, offset: 20 },
        function(err, data) {
          if (err) {
            console.error('Something went wrong!');
          } else {
            const albums = data.body.items;
             res.render("albums", {albums
            });
          }
        }
      );
})


module.exports = router;