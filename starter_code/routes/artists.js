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



/* GET artists page */
router.get('/', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(function(data) {
      let artistlist = data.body.artists.items
      console.log(artistlist)

      res.render('artistslist',{artistlist})
    })
    .catch(err=>console.log(err))
    
})

module.exports = router;