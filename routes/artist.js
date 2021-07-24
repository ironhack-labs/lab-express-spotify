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

//search an artist
router.get('/artist-search', (req, res) => {
  //console.log(req.body.artist);
  spotifyApi
    .searchArtists(
      //query artist
      req.query.artist
    )
    .then((data) => {
      console.log(
        'The received data from the API ',
        data.body.artists.items[0]
      );
      // what we want to do after receiving the data from the API
      res.render('artist-search-results', {
        style: ['styleArtist.css'],
        artists: data.body.artists.items,
      });
    })
    .catch((error) => {
      console.log(`the error while searching artists occurred: ${error}`);
    });
});

module.exports = router;
