const router = require('express').Router()
const spotify = require("../config/spotify.config")
const {findArtist} = require('../controller/index')
const {findAlbums} = require('../controller/index')
const {findTracks} = require('../controller/index')



router.get('/', (req, res) => {
    res.render('home')
})
router.post('/artist-search', findArtist)
router.get("/albums/:artistId", findAlbums)
router.get("/tracks/:albumId", findTracks)

module.exports= router