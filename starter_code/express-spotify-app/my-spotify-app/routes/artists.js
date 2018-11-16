const express = require('express');
const router = express.Router();

const SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
const clientId = 'b14ca35f015747d98226ba8eef6f2542';
const clientSecret = '33fe8551067744848684b51eea2930e0';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

/* GET home page. */
router.get('/', (req, res, next) => {
  const artistInfo = req.query.artistInfo;
  spotifyApi.searchArtists(artistInfo)
    .then(data => {
      const artists = data.body.artists.items;
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artists', { artists });
    })
    .catch(next);
});

module.exports = router;
