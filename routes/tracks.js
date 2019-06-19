const express = require('express');
const router = express.Router();

 const spotifyApi = require('../helpers/spotify');

 router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const trackArray = await spotifyApi.getAlbumTracks(id);
    res.render('tracks', { tracks: trackArray.body.items });
  } catch (error) {
    next(error);
  }
});

 module.exports = router;