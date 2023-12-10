const express = require('express');
const router = express.Router();
const spotifyApi = require('./../services/spotyfyAPI.service')

router.get("/:tracksId", (req, res) => {
    const { tracksId } = req.params
    spotifyApi
        .getAlbumTracks(tracksId)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render('tracks.hbs', data.body);
        })
        .catch(err => console.log(err));
});


module.exports = router;