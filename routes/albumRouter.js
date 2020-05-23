const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

router.get('/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    spotifyApi
        .getArtistAlbums(artistId, {limit:10})
        .then(data => res.render('albums', {albums: data.body.items}))
        .catch(err => console.log('The error while searching albums: ', err));
})

module.exports = router;