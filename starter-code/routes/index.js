const {Router} = require('express')
const router = Router();
const spotify = require('../config/spotify.config')
const {searchArtist} = require('../controllers/index')
const {getArtistAlbumsView} = require('../controllers/index')
const {getTracks} = require('../controllers/index')


router.get("/", (req, res) => {
    res.render('home')
})

router.get("/artist-search", (req, res) => {
    res.render('artist-search-results')})
router.post("/artist-search", searchArtist)

router.get("/albums/:artistId", getArtistAlbumsView)
router.get("/tracks/:tracksId", getTracks)



module.exports = router;
