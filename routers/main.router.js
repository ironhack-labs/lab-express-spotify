const router = require("express").Router()
const controller = require("../controllers/main.controller")

router.get("/", controller.home)

router.get("/artist-search", controller.artists)

router.get("/albums/:id", controller.albums)

router.get("/tracks/:id", controller.tracks)

module.exports = router