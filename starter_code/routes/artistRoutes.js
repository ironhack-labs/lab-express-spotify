const express = require('express');

const {
  index,
  searchArtistByName,
  searchArtistAlbums,
  searchAlbumTracks,
} = require('../controllers/artistRoutes.controller');

const router = express();

router.get('/', index);
router.get('/artists', searchArtistByName);
router.get('/albums/:artistId', searchArtistAlbums);
router.get('/tracks/:albumId', searchAlbumTracks);

module.exports = router;
