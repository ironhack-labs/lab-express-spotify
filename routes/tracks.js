const express = require('express');
const router = express.Router();

//get albums tracks
router.get('/albums/:albumId/tracks', (req, res) => {
  spotifyApi
    .getAlbumTracks(
      //find tracks by albumId
      Album.findById(req.params.id)
    )
    .then((data) => {
      console.log('Albums tracks', data.body);
      res.render('/track-information', {
        style: ['styleTrack.css'],
        tracks: data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
