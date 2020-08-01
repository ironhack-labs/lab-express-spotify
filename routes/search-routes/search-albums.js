const express = require('express');
const router  = express.Router();
const spotifyApi = require('../../config/spotifyConfig');

/* GET search page */
router.get('/album/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            const artistData = data.body;
            console.log('The received data from the API: ', artistData);
            res.render('albums', {artistData});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));  
});

module.exports = router;