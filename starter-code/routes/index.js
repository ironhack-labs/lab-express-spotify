const {Router} = require('express')
const {searchArtist,getAlbums,getTracks} = require('../controllers')
const router = Router()
let spotify = require('../config/spotify.config')


router.get('/', (req, res) => { res.render("home")  })
router.post("/artist-search",searchArtist)
router.get('/artist-search', (req, res) => { res.render("artist-search")  })


router.get('/albums/:artistID',getAlbums)
router.get('/tracks/:tracksID',getTracks)



module.exports = router