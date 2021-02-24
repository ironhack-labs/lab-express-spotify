const express = require("express");
const axios = require("axios");

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
  response.render("home");
});

router.get("/artist-search", (request, response) => {
  //   console.log(request.query);

  spotifyApi.searchArtists(request.query.searchTerm).then(
    function (data) {
      //   console.log("Search artists:", data.body.artists.items);
      const artists = data.body.artists.items;
      response.render("artist-search-results", { artists });
    },
    function (err) {
      console.error(err);
    }
  );
});

router.get("/albums/:id", (request, response) => {
  const { id } = request.params;
  //   console.log("this artist id: ", id);
  spotifyApi.getArtistAlbums(id).then(
    function (data) {
      console.log("Album information", data.body.items);
      const albums = data.body.items;
      response.render("artist-albums", { albums });
    },
    function (err) {
      console.error(err);
    }
  );
});

router.get("/tracks/:id", (request, response) => {
  const { id } = request.params;
  spotifyApi.getAlbumTracks(id).then(
    function (data) {
      console.log(data.body.items);
      const tracks = data.body.items;
      response.render("album-tracks", { tracks });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

module.exports = router;
