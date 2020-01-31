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

// Get search results
app.get("/", (request, response) => {
  console.log("/");
  response.render("index.hbs");
});

app.get("/artist-search", (request, response) => {
  spotifyApi
    .searchArtists(request.query.artist)
    .then(data => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items[0].id
      );

      response.render("artist-search-results.hbs", {
        artistList: data.body.artists.items
      });

      //   response.json(data.body.artists.items);
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Get albums of an artist
app.get("/albums/:id", (request, response) => {
  spotifyApi.getArtistAlbums(request.params.id).then(
    function(data) {
      console.log("Artist albums", data.body.items);
      response.render("albums.hbs", {
        artistAlbums: data.body.items
      });
      //   response.json(data.body.items);
    },
    function(err) {
      console.error(err);
    }
  );
});

// Get tracks of an album
app.get("/tracks/:id", (request, response) => {
  spotifyApi.getAlbumTracks(request.params.id).then(
    function(data) {
      console.log(
        "Album tracks",
        data.body.items[0].name,
        data.body.items[0].preview_url
      );

      response.render("tracks.hbs", {
        albumTracks: data.body.items
      });
      //   response.json(data.body.items);
    },
    function(err) {
      console.error(err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
