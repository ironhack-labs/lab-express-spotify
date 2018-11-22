var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
const router = express.Router()

// Remember to paste your credentials here
var clientId = '3197ad10c1284cd1bcf921cf280c12ee',
    clientSecret = 'febf08b7702d400f86df39a54b5dbd41';

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
    if(search) {
        spotifyApi.searchArtists(search, {limit:2})
        .then(data =>{
            console.log(data)

        })
        .catch(error=>{
            console.log(error)
        })
    }else {
        res.render('home')
    }
})

module.exports = router