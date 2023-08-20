const express = require("express");
const router = express.Router();

const spotiController = require("../controllers/spotify.controller.js")


router.get("/", (req, res ) => {res.render("home")});

router.get("/artist", spotiController.searchArtists);

router.get("/albums/:artistId", spotiController.searchAlbums );

router.get("/tracks/:albumId", spotiController.searchTracks)

module.exports = router;