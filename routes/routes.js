var SpotifyWebApi = require("spotify-web-api-node")
const express = require("express")
const router = express.Router()

var clientId = '52c614e7c8ff445c904327cb2e0983fa',
    clientSecret = '60a0c85acd824539bd7db7ca3d6cda4c';

var spotifyApi = new SpotifyWebApi({
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

router.get("/", (req, res) => {
  const {search} = req.query
  if(search){
    spotifyApi.searchArtists(search, {limit: 1})
            .then(data => {
              let artist = data.body.artists.items
                res.render("artists", {artist})
            })
            .catch(error => {
              console.log(error)
            })

  }else{
    res.render("home")
  }
})



router.post("/", (req, res) => {
  res.redirect("/artists")
})

module.exports = router


