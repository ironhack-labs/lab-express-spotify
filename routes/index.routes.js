const capitalized = require("../utils/capitalized");
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

// Retrieve an access token

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/artist-search", (req, res, next) => {
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      res.render("artist-search.hbs", {
        artists: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

router.get("/artist-albums/:id", (req, res, next) => {
  const { id } = req.params;
  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      res.render("artist-albums.hbs", {
        albums: data.body.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

router.get("/album-tracks/:id", (req, res, next) => {
  const { id } = req.params;
  spotifyApi
    .getAlbumTracks(id)
    .then((data) => {
      res.render("album-tracks.hbs", {
        tracks: data.body.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

module.exports = router;
