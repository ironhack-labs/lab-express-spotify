const express = require('express');
const router  = express.Router();
const SpotifyWebApi = require('spotify-web-api-node')


const clientId = '1003959cc35b41e58cf58d74cf518ca9'
    clientSecret = '43982232b9824cddb7db9eceb71c5f6b'

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




  router.get('/:id', (req, res) => {

    spotifyApi.getArtistAlbums(req.params.id)
    console.log("The received data from the API: ", albums.body.albums.items)
      .then( albums => {
        
      res.render('albums', {albums: albums.body.items})
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      })
 })


module.exports = router