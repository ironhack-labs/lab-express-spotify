const express = require('express');
const router  = express.Router();
const spotifyApi = require('../../config/spotifyConfig');

/* GET search page */
router.get('/', (req, res, next) => {

    console.log(typeof req.query.search)

    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artist-search', data.body);
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));  
});

module.exports = router;