require("dotenv").config();

const { response } = require("express");
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
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token

const token = async () => {
  try {
    let response = await spotifyApi.clientCredentialsGrant();

    spotifyApi.setAccessToken(response.body["access_token"]);
  } catch (err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
};

token();

// Our routes go here:
app.get("/", (request, response) => {
  response.render("index");
});

app.get("/artist-search", async (request, response) => {
  try {
    let spotifyResponse = await spotifyApi.searchArtists(
      request.query.artistName
    );
    response.render("artist-search-results", {
      data: spotifyResponse.body.artists.items,
    });
    //
    //   .catch(err => console.log('The error while searching artists occurred: ', err));
  } catch (err) {
    console.log("The error while searching artists occurred: ", err);
  }
});

app.get("/albums/:id", async (request, response) => {
  try {
    let spotifyResponse = await spotifyApi.getArtistAlbums(request.params.id);
    response.render("albums", { data: spotifyResponse.body.items });
    //
    //   .catch(err => console.log('The error while searching artists occurred: ', err));
  } catch (err) {
    console.log("The error while searching artists occurred: ", err);
  }
});

app.get("/tracks/:id", async (request, response) => {
  console.log("id for the album", request.params);
  try {
    let spotifyResponse = await spotifyApi.getAlbumTracks(request.params.id);
    response.render("tracks", { data: spotifyResponse.body.items });
  } catch (err) {
    console.log("The error while searching artists occurred: ", err);
  }
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
