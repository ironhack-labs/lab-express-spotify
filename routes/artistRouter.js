const express = require('express');
const router = express.Router();
const spotifyApi = require('./spotifyConfig');

router.get('/', (req, res, next) => {
    const artist = req.query.artist;
    spotifyApi
        .searchArtists(artist, {limit:8})
        .then(data => {
            res.render('artist-search-results', {artists: data.body.artists.items});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

module.exports = router;