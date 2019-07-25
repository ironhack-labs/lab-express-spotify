const express = require('express');
const router  = express.Router();
const SpotifyWebApi = require('spotify-web-api-node') 
const bodyParser   = require('body-parser');
// const Artist = require('../models/Artist.model')
// require spotify-web-api-node package here:

const clientId = process.env.CLIENT_ID,
      clientSecret = process.env.CLIENT_SECRET 




// setting the spotify-api goes here:


const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })




router.get('/:id', (req, res, next) => {

  spotifyApi.getArtistAlbums(req.params.id)
  .then(data =>  {

    // console.log(data.body.items)
    
    res.render("albums", {data : data.body.items})

  })
  .catch(err => {
    console.log("The error while searching albums occurred: ", err);
  })

})
module.exports = router