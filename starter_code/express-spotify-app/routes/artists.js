const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
const clientId = '40a5b0f2559e46a697af11691b805871';
const clientSecret = '32be3b9e100d4392bafdbc7a7ce4c326';
const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, err => {
    console.log('Something went wrong when retrieving an access token', err);
  });

/* GET users listing. */
router.get('/', (req, res, next) => {
  console.log(req.query);
  console.log(req.query.artist);
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist', data.body.artists);
    })
    .catch(next);
});

module.exports = router;
