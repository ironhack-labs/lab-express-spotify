const express = require("express");
const router = express.Router();
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

router.get("/", (request, response) => {
  response.render("index");
});

router.get("/artistSearch", async (request, response) => {
  try {
    const artistList = await spotifyApi.searchArtists(request.query.searchTerm);
    const results = [...artistList.body.artists.items];
    response.render("artistSearch", { results });
  } catch (err) {
    console.log("The error while searching artists occurred: ", err);
  }
  //   response.render("artist-search");
});

router.get("/albums/:artistId", async (request, response) => {
  try {
    const albumsList = await spotifyApi.getArtistAlbums(
      request.params.artistId
    );
    const albumResults = albumsList.body.items;
    response.render("albums", { albumResults });
    console.log(albumResults);
  } catch (err) {
    console.log("The error while searching artists occurred: ", err);
  }
});

router.get("/tracks/:albumsId", async (request, response) => {
  try {
    const tracksList = await spotifyApi.getAlbumTracks(request.params.albumsId);
    const tracksResults = tracksList.body.items;
    response.render("tracks", { tracksResults });

    // console.log("The received data from params tracks: ", tracksResults);
  } catch (err) {
    console.log("The error while searching artists occurred: ", err);
  }
  //   response.render("artist-search");
});

module.exports = router;
