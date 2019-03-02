const express = require('express');
const router = express.Router();
const spotifyApi = require('./spotifywebapi')

/* GET home page. */
router.get('/', (req, res) => {
  spotifyApi.searchTracks('Love')
    .then(data => res.render('index', { tracksArray: data.body.tracks.items }), err => console.error(err));
});

module.exports = router;