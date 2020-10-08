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

router.get("/", (req, res) => res.render("home"));

router.get("/artist-search", async (req, res) => {
  try {
    const result = await spotifyApi.searchArtists(req.query.artistSearch);
    console.log(result.body.artists.items);
    res.render("artist-search-results", { artists: result.body.artists.items });
  } catch (err) {
    console.log("The error while searching artists occurred: ", err);
  }
});

module.exports = router;
