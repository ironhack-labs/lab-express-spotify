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

//get one artist with all his/her albums
router.get('/artists/:artistId', (req, res) => {
  spotifyApi
    .getArtistAlbums(
      //find albums by artistId
      req.params.artistId
    )
    .then((data) => {
      //console.log('Artist albums ', data.body);
      res.render('albums', {
        style: ['styleAlbum.css'],
        albums: data.body.items,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
