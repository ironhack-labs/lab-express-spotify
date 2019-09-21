const express = require('express');
const router = express.Router();
require("dotenv").config();
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log("access-success-log",data)
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

 let searchName = "43ZHCT0cAZBISjO8DG9PnE"

 /* GET ALBUM DEFAULT */
router.get('/', function(req, res, next) { //http://localhost:3000/albums
    res.send('this is a default track route');  // display message on browser
});

/* RENDER MAIN PAGE. */
router.get('/:name', function(req, res, next) {
  debugger;
  const name = req.params.name;
  spotifyApi.searchTracks(name)
    .then(data => {
      debugger;
      console.log("trackmname", data.body.tracks.items[0].name);
      debugger;
      res.render("tracks",{allTracks:data.body.tracks.items});

    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
      debugger;
      console.log(err);
    })
});


module.exports = router;