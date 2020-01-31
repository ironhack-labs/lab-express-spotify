const {Router} = require('express')
const spotifyApi = require('./../config/spotify.config')

const router = Router()

router
.get('/', (req, res)=>{
    res.render('home')
})
.post('/artist-search', (req, res)=>{
    spotifyApi.searchArtists( req.body.search )
    .then(data => {
        // console.log("result", data.body.artists)
        //es.send(data.body.artists)
        res.render('artist-search-result', data.body.artists)
    })
    .catch(err => console.log('The error while searching artists ocurred.'))
})
.get('/albums/:artistId', (req, res,next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data=>{
        //console.log(data.body)
        res.render('albums',data.body)
    }).catch
    
})
.get('/tracks/:albumId',(req,res,next)=>{
    //res.send(req.params)
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data=>{
        //console.log(data.body)
        res.render('tracks',data.body)
    })
})
module.exports = router


