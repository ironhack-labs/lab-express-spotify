const express = require('express')
const router = express.Router()
const spotifyWebApi = require('spotify-web-api-node')
 const spotifyApi = new spotifyWebApi({
  clientId : "a2460ffdb9794b88b624860943e7dd5d",
  clientSecret : "6cc7d87f83c5455393ff6add18796fe3"
});
 spotifyApi.clientCredentialsGrant()
  .then(function(data) {
     spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});
 router.get('/', (req, res)=>{
  res.render('index')
})
 router.get('/artist', (req, res)=>{
  res.render('index')
})
 router.post('/artist', (req,res)=>{
   const artista = req.body.artista
   spotifyApi.searchArtists(artista)
  .then(data =>{
    res.render('artist', data)
  })
  .catch(err=>{
    console.log(err)
  })
})
 router.get('/albums/:id', (req,res)=>{
   const id = req.params.id
   spotifyApi.getArtistAlbums(id)
  .then(data =>{
    res.render('albums',data)
  })
  .catch(err=>{
    console.log(err)
  })
})
 module.exports = router 