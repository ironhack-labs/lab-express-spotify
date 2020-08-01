const express = require('express');
const router  = express.Router();
const spotifyApi = require('../../config/spotifyConfig');

/* GET tracks page */
router.get('/:ablumId', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.ablumId)
        .then(data => {
            const tracksData = data.body.items;
            console.log('The received tracks data from the API: ', tracksData[0]);
            res.render('tracks', {tracksData});
        })
        .catch(err => console.log('The error while searching tracks occurred: ', err));  
});

module.exports = router;