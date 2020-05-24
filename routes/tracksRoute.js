const express = require("express");
const router = express.Router();

const spotifyApi = require("../data/spotifyApi");

router.get("/:tracksId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.tracksId)
    .then((data) => {
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((e) => console.log("Error when show Tracks was occurred:", e));
});

module.exports = router;
