const express = require('express');
const router = express.Router();
const spotifyApi = require('./spotifyConfig');

router.get('/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => res.render('tracks', {tracks: data.body.items}))
        .catch(err => console.log('The error while searching tracks: ', err))
})

module.exports = router;