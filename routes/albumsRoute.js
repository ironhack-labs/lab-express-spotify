const express = require("express");
const router = express.Router();

const spotifyApi = require("../data/spotifyApi");

router.get("/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId, { limit: 10, offset: 20 })
    .then((data) => {
      //console.log(data.body);
      res.render("albums", { albums: data.body.items });
    })
    .catch((e) => console.log("Error when show Albums was occurred:", e));
});

module.exports = router;