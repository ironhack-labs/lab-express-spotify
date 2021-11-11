const router = require("express").Router();
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/artist-search", (req, res, next) => {
  console.log(req.query);
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      res.render("artist-search-results");
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

module.exports = router;
