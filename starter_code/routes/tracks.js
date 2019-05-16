const express = require('express')
const router = express.Router()


const SpotifyWebApi = require('spotify-web-api-node')

// setting the spotify-api goes here:

const clientId = '7fa2c96746a4442383a0a2b49f21aecd',
    clientSecret = '3329b53a46a14134976a7e2e7f63f5c5';

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

console.log(req.params.id)

spotifyApi.getAlbumTracks(req.params.id)
.then(function(data) {
    res.render('tracks', {tracks: data.body.items})   
    console.log(data.body);
}, function(err) {
    console.log('Something went wrong!', err);
})

});


module.exports = router

  
