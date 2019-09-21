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

// let searchName = "Beatles"

/* RENDER MAIN PAGE. */
router.get('/', function(req, res, next) {
  // res.render("artists");
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      debugger;
      // console.log("urlParams", req.query.artist);
      console.log("artist",data.body.artists.items[0].name);
      res.render("artists",{ searchName:req.query.artist,artistsAll:data.body.artists.items});
      // res.render("artists",{artistName:data.body.artists.items[0].name,imgAll:data.body.artists.items[0].images});
        //, imgURL:data.body.artists.items[0].images[0].url 
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
      debugger;
      console.log(err);
    })
});


module.exports = router;