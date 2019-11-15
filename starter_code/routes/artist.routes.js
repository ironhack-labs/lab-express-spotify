const express = require('express');
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  })

router.get("/", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artistSerch)
    .then(data => {
      //console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist", {
        data
      })
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
})
router.get("/albums/:id",(req,res,next) =>{
 spotifyApi
   .getArtistAlbums(req.params.id)
   .then(data => { 
     console.log(data.body.items)
     res.render("albums", {

       data
     })
   })
   .catch(err => {
     console.log("The error while searching artists occurred: ", err);
   });
 })
 router.get("/tracks/:id", (req, res, next) => {
   spotifyApi
     .getAlbumTracks(req.params.id)
     .then(data => {
       console.log(data)
       res.render("tracks", {

         data
       })
     })
     .catch(err => {
       console.log("The error while searching artists occurred: ", err);
     });
 })


module.exports = router;

