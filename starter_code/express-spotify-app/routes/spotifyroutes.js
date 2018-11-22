var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
const router = express.Router()

// Remember to paste your credentials here
var clientId = '5a4842ba39bd45a5b95f9b12f7be1a54',
    clientSecret = '92cef8bf488d4f6d995ab69f7e4f3c7b';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

//Muestra formulario
router.get('/',(req,res)=>{
  const {search} = req.query
  const busqueda = {
    name:search
  }
  if(search){
    spotifyApi.searchArtists(search,{limit:3})
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      console.log(data)
      let artists = data.body.artists.items
      res.render('artists',{artists}) 
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
      console.log(err)
    })
  } else {
    res.render('home')
  }
})

module.exports = router