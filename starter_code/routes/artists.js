var express = require('express');
var router = express.Router();

const SpotifyWebApi = require("spotify-web-api-node");
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

router.post('/', function (req, res, next) {

  const {
    name
  } = req.body;

  spotifyApi
    .searchArtists(name)
    .then(data => {
      // req.app.locals.name = name
      let items = data.body.artists.items;
      let package = [];
      for (let index = 0; index < items.length; index++) {
        if (items[index].images.length > 0) {
          let obj = {
            id: items[index].id,
            name: items[index].name,
            image: items[index].images[1].url
          }
          package.push(obj);
        }
      }

      res.render("artists", {
        package
      });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });


  // res.render('artists');

});

module.exports = router;