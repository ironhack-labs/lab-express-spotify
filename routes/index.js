let router = require ('express').Router()
let spotifyApi = require('../middlewares/spotifyConfig')


router.get('/', (req,res)  => {
    res.render('index')
  })
  
  router.get('/artists', (req, res) => {
    res.render('artists')
  })

router.post("/artists", (req,res)=>{
    spotifyApi.searchArtists(req.body.searchArtist)
    .then(data => {
        res.render('artists', {data}) 
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

router.get('/albums/:artistId', (req,res)=>{
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(item=>{
        res.render('albums', item)
    })
   . catch(e=>res.render(e))
})

router.get('/tracks/:id', (req,res) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then(item =>{
        res.render('tracks', item)
    })
    .catch(e=> res.send(e))
})

module.exports = router
