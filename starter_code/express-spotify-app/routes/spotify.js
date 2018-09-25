const express = require('express')
const router = express.Router()
const spotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new spotifyWebApi({
  clientId : "d5e178217f204beb8bd4ae7c809a83b0",
  clientSecret : "1f8c625232ff48069524fb55799b00cb"
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