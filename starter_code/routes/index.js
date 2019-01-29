const express = require('express');
const router  = express.Router();
const SpotifyWebApi= require('spotify-web-api-node');
  

require('dotenv').config();

    // Remember to paste your credentials here
  const clientId = process.env.clientId;
        clientSecret = process.env.clientSecret;
    
    const spotifyApi = new SpotifyWebApi({
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
    res.render('homepage');
  });
  
  router.get('/artists', (req, res,next)=>{
    spotifyApi.searchArtists(req.query.artist)
      .then(data => {
        const artists = data.body.artists.items;
        console.log(artists);
        res.render('artists', {artists});
      })
      .catch(err => {
        res.send("CRASH!!!!" + err);
      })
  })

  router.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
      .then(data => {
        console.log('Artist albums', data.body.items)
        res.render('albums', { albums: data.body.items})  
      })
      .catch(err => {console.log(err)
      });
  })

  router.get('/tracks/:albumName', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumName)
    .then(data => {
      console.log('Artist tracks', data.body.items)
      res.render('tracks', { tracks: data.body.items})  
    })
    .catch(err => {console.log(err)
    });
  })

  
   
  module.exports = router;