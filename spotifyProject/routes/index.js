const express = require('express');
const router  = express.Router();
const spotifyWebApi = require('spotify-web-api-node');

var clientId = '93d59ad2107e4d9c8c055c4b4880b336',
    clientSecret = '22bb811837cf47b39e25c6e5f84f335c';

var spotifyApi = new spotifyWebApi({
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

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/search', (req, res) =>{
  var searchData = req.body.dataInput
  spotifyApi.searchArtists(searchData)
  .then((data) => {
    res.render("searched", {output1: data.body.artists.items})
   
  })
  .catch(err => console.log(err))
  
})

module.exports = router;
