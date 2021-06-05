const express = require('express');
const artists = require('../controllers/artists.controller');

const router = express.Router();


router.get('/', artists.home);

router.get('/artist-search', artists.artistSearch);

router.get('/albums/:artistId', artists.albumSearch);

router.get('/tracks/:albumId', artists.trackSearch);


module.exports = router;