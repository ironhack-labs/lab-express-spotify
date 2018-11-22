var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
const router = express.Router()

// Remember to paste your credentials here
var clientId = 'b527e8cea1eb44479b510b93de75d167',
    clientSecret = '8f169e89dccb4c15952c3fe405d391ec';

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



router.get('/', (req,res)=>{
  const {search} = req.query
  //busqueda = {
    //name:search
  //}
  if(search){
    spotifyApi.searchArtists(search, {limit:2})
      .then(data=>{
        console.log(data)
      }).catch(error =>{
          console.log(error)
      })
      
    //res.render('artists',busqueda)
  }else{
    res.render('home')
  }
 
})

module.exports = router