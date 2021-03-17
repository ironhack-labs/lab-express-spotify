require("dotenv").config();

const { request } = require("express");
const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (request, result, next) => {
  result.render("index");
});

app.get("/artist-search", (request, result, next) => {
  const artistName = request.query.artist;

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      //   console.log("the data received from the API: ", data);
      //   console.log("Items: ", data.body.artists.items);
      //   console.log("first item image: ", data.body.artists.items[0].images[0]);
      result.render("search-results", data.body.artists.items);
    })
    .catch((error) => console.log("error searching artists: ", error));
});

app.get("/albums/:artistId", (request, result, next) => {
  spotifyApi
    .getArtistAlbums(request.params.artistId)
    .then((data) => {
      //   console.log(data.body.items[0]);
      const artist = data.body.items[0].artists[0].name;
      result.render("albums", { artist: artist, albums: data.body.items });
    })
    .catch((error) => console.log("error searching albums: ", error));
});

app.get("/tracks/:albumId", (request, result, next) => {
  spotifyApi
    .getAlbumTracks(request.params.albumId)
    .then((data) => {
      //   console.log(data.body.items[0]);
      result.render("tracks", data.body.items);
    })
    .catch((error) => console.log("error getting album tracks: ", error));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
