const express = require("express");
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");

// console.log("al menos entro el archivo")
// router.get("/", (req, res, next) => {
//   console.log("entro en la ruta")
//   res.render("artist");
// });

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

router.get("/", (req, res) => {
  console.log("aaaaaa:", req.query);

  spotifyApi
    .searchArtists(req.query.search)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items); ///porque
      res.render("artist", { artist: data.body.artists.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});






module.exports = router;
