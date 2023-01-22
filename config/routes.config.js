const express = require("express");
const router = express.Router();

const controller = require('../controllers/spotify.controller')

router.get("/", controller.home);
router.get("/artist-search", controller.search);
router.get("/albums/:id", controller.albums);
router.get("/tracks/:id", controller.tracks);


module.exports = router;