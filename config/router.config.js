const express = require("express");
const router = express.Router();

const controller = require("../controllers/spotify.controller.js");
router.get("/", controller.home);
router.get("/artist-search", controller.search);

module.exports = router;
