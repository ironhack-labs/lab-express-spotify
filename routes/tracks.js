const express = require('express');
const router = express.Router();

//////////////////////////////////////////////
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );
//////////////////////////////////////////////
//////////////////////////////////////////////

//get albums tracks
router.get('/albums/:albumId/tracks', (req, res) => {
  spotifyApi
    .getAlbumTracks(
      //find tracks by albumId
      req.params.albumId
    )
    .then((data) => {
      //console.log('Albums tracks ', data.body);
      res.render('track-information', {
        style: ['styleTrack.css'],
        tracks: data.body.items,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
