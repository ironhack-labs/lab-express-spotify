const express = require('express');
const router  = express.Router();

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CID,
    clientSecret: process.env.SPOTIFY_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {spotifyApi.setAccessToken(data.body['access_token'])})
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

/* GET artists page */
router.get('/artists', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const artist = { artist: data.body.artists.items };
            //console.log("asdasd",artist);
            res.render('artists', artist)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
  });



module.exports = router;