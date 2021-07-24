const express = require('express');
const router = express.Router();

//get one artist with all his/her albums
router.get('/albums/:artistId', (req, res) => {
  spotifyApi
    .getArtistAlbums(
      //??find albums by artistId ???
      Artist.findById(req.params.id)
    )
    .then((data) => {
      console.log('Artist albums', data.body);
      res.render('albums', {
        style: ['styleAlbum.css'],
        albums: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
