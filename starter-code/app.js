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
  response.render("index.hbs");
});

app.get("/artist-search", (request, response) => {
  console.log("request.query: ", request.query);
  spotifyApi
    .searchArtists(request.query.artist)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      response.render("artist-search-results.hbs", {
        artists: data.body.artists.items
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (request, response) => {
  //params
  //query
  console.log("requested.query: ", request.params.artistId);
  spotifyApi
    .getArtistAlbums(request.params.artistId)
    .then(data => {
      console.log("Artist albums", data.body);
      response.render("albums.hbs", {
        albums: data.body
      });
    })
    .catch(err => console.log(err));
});

app.get("/tracks/:albumId", (request, response) => {
  console.log("requested.params ", request.params.albumId);
  spotifyApi
    .getAlbumTracks(request.params.albumId)
    .then(data => {
      console.log("Albums tracks", data.body);
      response.render("tracks.hbs", {
        tracks: data.body
      });
    })
    .catch(err => console.log(err));
});

app.listen(3333, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
