const express= require('express')
const router = express.Router()

const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '0b4efa40d8644d8caf4e268185cb838e',
 clientSecret='e6dafb7fc39e4571b4847f9fe12bdb97'

 const spotifyApi = new SpotifyWebApi({
 clientId,
 clientSecret
})

router.get('/',(req,res)=>{
 res.render('home')
})

router.get('/artists',(req,res)=>{
 res.render()
})
router.post('/artists',(req,res,next)=>{
 const nuevoArtist =req.body
 spotifyApi.searchArtists(nuevoArtist)
 .then(artist=>{
   res.render('artists',artist)
 })
 .catch(e=>next(e))
})

module.exports = router