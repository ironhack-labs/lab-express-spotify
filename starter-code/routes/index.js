const {Router} = require('express')
const router = Router();
const spotify = require('../config/spotify.config')
const {searchArtist} = require('../controllers/index')


router.get("/", (req, res) => {
    res.render('home')
})


router.post("/artist-search", searchArtist)
router.get("/artist-search", (req, res) => {
    res.render('artist-search-results')
})


module.exports = router;
