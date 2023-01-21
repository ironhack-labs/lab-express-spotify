const express = require("express");
const router = express.Router();

const controllers = require("../controllers/spotify.controller");

router.get("/", controllers.home);

router.get("/artist-search", controllers.result);

router.get("/albums/:id", controllers.albums);

module.exports = router;
