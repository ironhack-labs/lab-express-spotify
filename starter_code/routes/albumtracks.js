const express = require('express');
const router = express.Router();
const spotifyApi = require('./spotifywebapi');


router.get('/albumtracks', (req, res) => {
  spotifyApi.getAlbumTracks(req.query.id, { limit: 5, offset: 1 })
    .then(data => res.render('albumtracks', { albumtracks: data.body.items }), err => {
      console.log('Something went wrong!', err);
    });
});

module.exports = router;