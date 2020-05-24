const express = require("express");
const router = express.Router();

const spotifyApi = require("../data/spotifyApi");

router.get("/", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      res.render("artistSearch", { artist: data.body.artists.items });
    })
    .catch((e) => console.log("Error when searching artist was occurred: ", e));
});

module.exports = router;
