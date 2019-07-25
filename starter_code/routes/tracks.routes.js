require('dotenv').config();
const express = require('express');
const router  = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

const clientId = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET


const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
})


spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

  
  
  
  
  router.get('/:id', (req, res, next)=>{
    console.log(req.params.id)
    
      spotifyApi.getAlbumTracks(req.params.id)
      .then(data => {
    
        console.log("The received data from the API: ", data.body.items);
    
         res.render('tracks', {data : data.body.items})
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      })
})


module.exports = router;