const router = require('express').Router()
const spotifyVars = require("../config/spotify.config")
const {findArtist} = require('../controller/index')



router.get('/', (req, res) => {
    res.render('home')
})

router.post('/artist-search', findArtist )
module.exports= router