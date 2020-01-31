const {Router} = require('express')
const router = Router();
const spotify = require('../config/spotify.config')
const {searchArtist} = require('../controllers/index')


router.get("/", (req, res) => {
    res.render('home')
})

router.get("/artist-search", (req, res) => {
    res.render('artist-search-results')})
router.post("/artist-search", searchArtist)



module.exports = router;
