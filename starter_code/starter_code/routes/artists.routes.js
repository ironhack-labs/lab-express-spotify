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




router.get('/', (req, res, next) => {

  spotifyApi.searchArtists(req.query.buscar)
  .then(data =>  {
    res.render("artist", {data : data.body.artists.items})
    // console.log("The received data from the API: ", data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })

})
module.exports = router