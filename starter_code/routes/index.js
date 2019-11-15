const express = require('express');

const {
    home,
    artists, 
    albums,
    tracks
} = require("../controllers/index.controller");

const router = express.Router();

router.get("/", home);

router.get("/artists", artists);

router.get("/albums/:artistId", albums);
router.get("/tracks/:trackIds", tracks);

module.exports = router;
