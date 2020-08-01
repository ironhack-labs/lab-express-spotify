const express = require('express');
const router  = express.Router();
const spotifyApi = require('../../config/spotifyConfig');

/* GET albums page */
router.get('/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            const albumsData = data.body.items;
            console.log('The received albums data from the API: ', albumsData[0]);
            res.render('albums', {albumsData});
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));  
});

module.exports = router;