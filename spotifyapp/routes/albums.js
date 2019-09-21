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
    res.send('this is a default album route');  // display message on browser
});

/* RENDER MAIN PAGE. */
router.get('/:id', function(req, res, next) {
  debugger;
  const id = req.params.id;
  spotifyApi.getArtistAlbums(id)
    .then(data => {
      debugger;
      console.log("albumname", data.body.items[0].name);
      // console.log("albumname", req.query.artist);
      // console.log("artist",data.body.artists.items[0].name);
      console.log("passing",data.body.items);
      res.render("albums",{allAlbums:data.body.items});
      // res.render("albums",{ albumName:data.body.items[0].name});
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