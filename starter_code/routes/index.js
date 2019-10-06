const express = require('express');
const router = express.Router();
const axios = require('axios');


router.get('/', (req, res) => {
  res.render('index');
});

router.post('/', (req, res) => {
    //empty previous search response
    global.searchResponse = null;

    //get info from form
    global.searchInput = req.body.artist;

    //check if field is filled in 
    if (global.searchInput === ''){
        res.render('index', {errorMessage: 'Fill in the name of the artist you want to look up'});
        return;
    }

    // STEP B: query the Spotify API using the access_token retrieved in step A
    axios({
            method: 'GET',
            url: "https://api.spotify.com/v1/search",
            headers: {Authorization:`Bearer ${global.access_token}`}, //Bearer is token type!
            params: {
                      type: 'artist', 
                      q: global.searchInput
                    }

         }) 
         .then((result) => {
            let artists = result.data.artists; 
            if (artists && artists.items.length > 0) {
                global.searchArtists = artists; 
                res.redirect('/artists')
            } else {
                res.render('index', {errorMessage: `Could not find artist: ${artist}`});
            }
         })
         .catch((err) => {
            res.send(err);
         })
});

module.exports = router;

