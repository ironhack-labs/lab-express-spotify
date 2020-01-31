const { Router } = require("express")
const spotifyApi = require("./../spotify.config.js")
const router = Router()

router.get("/", (req,res) =>{res.render('home')})
router.post("/artist-search", (req,res) => {
    spotifyApi.searchArtists(req.body.Search).then(data => {
        console.log(data.body)
        res.render("artist-search-results", data.body.artists)
    })
})

router.get("/albums/:artistId", (req,res, next) => {
    const {artistId} = req.params
    spotifyApi.getArtistAlbums(artistId).then(data => {
    console.log(data.body)
    res.render("albums", data.body)
    })
})

router.get("/tracks/:albumId", (req,res, next) => {
    const {albumId} = req.params
    spotifyApi.getAlbumTracks(albumId).then(data => {
    console.log(data.body)
    res.render("tracks", data.body.items)
    })
})




module.exports = router