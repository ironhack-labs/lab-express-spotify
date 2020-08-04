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
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

/* GET artists page */
router.get('/artists', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const artist = { artist: data.body.artists.items, artistName:  data.body };
            //console.log(req.query.artist);
            res.render('artists', artist)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  /* GET albums page */
  router.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            //console.log(`Artist information: ${data.body.items}`);
            res.render('albums', {artistAlbums: data.body.items})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  /* GET tracks page */
  router.get('/tracks/:albumID', (req, res, next) => {
    spotifyApi
        .getAlbum(req.params.albumID)
        .then(data => {
            //console.log(data.body.tracks);
            res.render('tracks', {album: data.body, tracks: data.body.tracks})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
  });  



module.exports = router;