const express = require('express');
const router = express.Router();
const spotifyApi = require('./spotifyConfig');

router.get('/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    spotifyApi
        .getArtistAlbums(artistId, {limit:10})
        .then(data => res.render('albums', {albums: data.body.items}))
        .catch(err => console.log('The error while searching albums: ', err));
})

module.exports = router;