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
  //console.log("/");
  response.render("home.hbs");
});
//ホームページへのルート

app.get("/artist-search", (request, response) => {
  //console.log(request.query);
  spotifyApi
    .searchArtists(request.query.name)
    .then(data => {
      //console.log("The recieved data from the API:", data.body);
      response.render("artist-search-results.hbs", {
        artist: data.body.artists.items
      });
      //response.render("Search artist", data.body.artists);
      //
    })
    .catch(err => console.log("The error searching artists occureed:", err));
  //Search
  //response.render("artist-search-results.hbs");
});
//サーチのルート

app.get("/albums/:albumId", (request, response) => {
  spotifyApi
    .getArtistAlbums(request.params.albumId)
    .then(data => {
      //console.log("Artist albums:", data.body);
      response.render("albums.hbs", {
        albums: data.body.items
      });
    })
    .catch(err => {
      console.log(err);
    });
});
//アルバムのルート

app.get("/tracks/:tracksId", (request, response) => {
  spotifyApi
    .getAlbumTracks(request.params.tracksId)
    .then(data => {
      //console.log("tracks:", data.body);

      response.render("tracks.hbs", {
        tracks: data.body.items
      });
    })
    .catch(err => {
      console.log(err);
    });
});
//アルバムのトラックのルート

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
