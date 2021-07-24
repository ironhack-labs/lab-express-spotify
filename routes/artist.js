const express = require('express');
const router = express.Router();

//search an artist
router.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(
      //query artist ???
      res.send(req.query)
    )
    .then((data) => {
      console.log(`The received data from the API: ${data.body}`);
      // what we want to do after receiving the data from the API
      res.render('artist-search-results', {
        style: ['styleArtist.css'],
        artists: data,
      });
    })
    .catch((error) => {
      console.log(`the error while searching artists occurred: ${error}`);
    });
});

module.exports = router;
