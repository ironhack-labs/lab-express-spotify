const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = require('./spotifywebapi')

router.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => res.render('artists', { artists: data.body.artists.items }), err => console.log(err));
});

module.exports = router;