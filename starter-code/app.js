require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (request, response) => {
  response.render("search.hbs");
});

app.get("/artist-search", (request, response) => {
  console.log("search");
  console.log("request query: ", request.query.artist);
  let search = request.query.artist;

  spotifyApi
    .searchArtists(search)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);

      response.render("artist-search-results.hbs", {
        artistsList: data.body.artists.items
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (request, response) => {
  spotifyApi.getArtistAlbums(request.params.artistId).then(
    function(data) {
      console.log("Artist albums", data.body);
      response.render("albums.hbs", data.body);
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:albumId", (request, response) => {
  spotifyApi
    .getAlbumTracks(request.params.albumId, { limit: 5, offset: 1 })
    .then(
      function(data) {
        console.log(data.body);
        //response.json(data.body);
        response.render("tracks.hbs", data.body);
      },
      function(err) {
        console.log("Something went wrong!", err);
      }
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
