const express = require('express');
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node")

const clientId = 'a81a8381c0934c85b28c9541fa51b216',
  clientSecret = 'a2c50de272d14f6787d39ac5d00c01e4';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});


// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {

    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

router.get('/', (req, res, next) => {
  console.log(req.query)
  spotifyApi.searchArtists(req.query.name)
    .then(data => {

      console.log("The received data from the API: ", data.body.artists.items);
      res.render('artists', { artists: data.body.artists.items })
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})












module.exports = router

