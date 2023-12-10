const express = require('express');
const router = express.Router();
const spotifyApi = require('./../services/spotyfyAPI.service')

router.get("/:artistsId", (req, res) => {
    const { artistsId } = req.params
    spotifyApi
        .getArtistAlbums(artistsId)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render('albums.hbs', data.body);
        })
        .catch(err => console.log(err));
});


module.exports = router;
