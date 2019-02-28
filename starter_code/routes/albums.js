const express = require('express');
const router  = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

// Remember to insert your credentials here
const clientId = process.env.CLIENTID,
    clientSecret = process.env.CLIENTSECRET

console.log(clientId, clientSecret)

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

console.log(spotifyApi)

//Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })



/* GET albums page */
router.get('/:id', (req, res, next) => {
  console.log(req.params.id)
  console.log(req.params)
  spotifyApi.getArtistAlbums(req.params.id)
    .then(function(data) {
      let albums = data.body.items
      console.log(albums[0].artists[0].name)
      res.render("albums",{albums})
    }, function(err) {
      console.error(err);
    });
  
})

module.exports = router;

