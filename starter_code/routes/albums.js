const express = require('express');
const router = express.Router();
// const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = require('./spotifywebapi');

router.get('/albums', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.query.id)
    .then(function(data) {
        res.render('albums', {albums: data.body.items})
    }, function(err) {
        console.error(err);
    });
})

module.exports = router;