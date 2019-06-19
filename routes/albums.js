const express = require('express');
const router = express.Router();

 const spotifyApi = require('../helpers/spotify');


 router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const albumArray = await spotifyApi.getArtistAlbums(id);
    // console.log(albumArray);
    // console.log(albumArray.body.items[0]);
    res.render('albums', { albums: albumArray.body.items });
  } catch (error) {
    next(error);
  }
});

 module.exports = router;