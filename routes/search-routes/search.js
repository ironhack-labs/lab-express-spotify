const express = require('express');
const router  = express.Router();
const spotifyApi = require('../../config/spotifyConfig');

/* GET search page */
router.get('/', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            const artistData = data.body.artists.items;
            // console.log('The received seach data from the API: ', artistData[0]);
            // console.log('The received data from the API: ', artistData[0].images);
            res.render('artist-search-results', {artistData});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));  
});

module.exports = router;