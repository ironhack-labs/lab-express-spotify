const { Router } = require("express")
const router = Router()
const { searchArtist, searchArtistView , searchAlbumsView, searchTracksView} = require("../controllers/index")


const spotify = require('../config/spotify.config')
router.get("/", (req, res) => {
    res.render('home')
})

router.get('/artist-search', searchArtistView)
router.post('/artist-search', searchArtist)

router.get('/albums/:artistId', searchAlbumsView)
router.get('/tracks/:albumId', searchTracksView)


module.exports = router

