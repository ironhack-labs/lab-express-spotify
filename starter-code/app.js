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

app.listen(4000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

app.get("/", (request, response) => {
  console.log("/");
  response.render("index.hbs");
});

app.get("/artist-search", (request, response) => {
  spotifyApi
    .searchArtists(request.query.artist)
    .then(data => {
      //   response.json(data.body);
      //   return;
      console.log("The received data from the API: ", data.body);
      response.render("artist-search-results.hbs", {
        artistList: data.body.artists.items
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (request, response) => {
  spotifyApi
    .getArtistAlbums(request.params.artistId)
    .then(data => {
      console.log("Artist albums", data.body);
      //   response.send(data.body);
      response.render("albums.hbs", {
        albumsList: data.body.items
      });
    })
    .catch(err => console.error(err));
});

app.get("/tracks/:tracksId", (request, response) => {
  spotifyApi
    .getAlbumTracks(request.params.tracksId)
    .then(data => {
      console.log("Track names", data.body);
      //   response.send(data.body);
      response.render("tracks.hbs", {
        tracksList: data.body.items
      });
    })
    .catch(err => console.error(err));
});
