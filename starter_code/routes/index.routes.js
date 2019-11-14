const express = require('express');
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node")

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });
/* GET home page */
router.get('/', (req, res) => {
  res.render('index')
  //console.log(req.query)
})
router.get('/artists', (req, res) => {
  console.log(req.query, "la query del demonio de hace una hora")

  spotifyApi.searchArtists(req.query.artists)
    .then(data => {
      console.log("eeeeeeeeeeeeeh  The received data from the API: ", data.body.artists);

      //res.render('artists', {data: req.query})
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artists', {
        data: data.body.artists.items[0].images[0].url
      })
      res.render('artists', {
        name: data.body.artists.items[0].name
      })
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });

})



module.exports = router;