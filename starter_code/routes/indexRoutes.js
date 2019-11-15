const express = require("express");
const router = express.Router();

const {
    home,
    artists,
    albums,
    tracks
} = require("../controllers/index.controller");



router.get("/", home);
router.get("/artists", artists);
router.get("/albums/:artistId", albums);
router.get("/tracks/:trackIds", tracks);




module.exports = router;