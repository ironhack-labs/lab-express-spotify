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

  
  
  
  
  router.get('/', (req, res, next)=>{
    // console.log(req.query.search-input)
    
      spotifyApi.searchArtists(req.query.search)
      .then(data => {
    
        // console.log("The received data from the API: ", data.body.artists.items);
    
        res.render('artist', {data : data.body.artists.items})
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      })
})


module.exports = router;