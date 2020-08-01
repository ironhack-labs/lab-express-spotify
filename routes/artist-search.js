const express = require('express');
const router = express.Router();

//GET artist search results

router.get("/", (req, res, next) => {
    spotifyApi
        .searchArtists(req.query, "i")
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render("/views/artist-search-results", {
                searchResults: data
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});

module.exports = router;