const router = require('express').Router();
const miscController = require('../controllers/misc.controller');
//const artistsController = require('../controllers/artists.controller');

//misc
router.get('/', miscController.getHome);
//router.get('/artist-search', artistsController.getArtists);


module.exports = router;