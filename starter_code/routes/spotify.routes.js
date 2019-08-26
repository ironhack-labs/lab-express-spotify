const express = require("express");
const {
  index,
  artist,
  artistId,
  albumId
} = require("../controlers/spotifyRoutes.Controler");

const router = express();

router.get("/", index);

router.get("/artists", artist);

router.get("/albums/:artistId", artistId);

router.get("/tracks/:albumId", albumId);

module.exports = router;
