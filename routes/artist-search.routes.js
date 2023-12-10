const express = require('express');
const router = express.Router();
const spotifyApi = require('./../services/spotyfyAPI.service')

router.get("/", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results', data.body.artists)
    })  
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

module.exports = router;
