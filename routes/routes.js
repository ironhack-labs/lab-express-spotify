const router = require('express').Router()
const maincontroller = require ('../controllers/main.controller')

router.get('/', maincontroller.renderIndex)
router.get('/artist-search', maincontroller.getArtistSearch)
router.get('/albums/:artistId', maincontroller.getAlbums);
router.get('/albums/:albumId/tracks', maincontroller.getAlbumTracks);

module.exports = router;
