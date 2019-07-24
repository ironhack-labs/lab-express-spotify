const express = require('express');
const router = express.Router();
const spotifyApi = require('../spotifyApi');

router.get("/", (req, res, next)=> {
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        const artists = data.body.artists.items;
        res.render("artist", {artists});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

module.exports = router;