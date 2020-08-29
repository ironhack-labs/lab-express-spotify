const express = require("express")
const router = express.Router()
const {index, artistSearch, albumsId, tracksId } = require("../controllers")


router.get("/", index)
router.get("/artist-search", artistSearch)
router.get("/albums/:id", albumsId)
router.get("/tracks/:trackId/", tracksId)

module.exports = router