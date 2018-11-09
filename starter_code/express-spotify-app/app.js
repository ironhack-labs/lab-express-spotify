//SETUP

const express = require("express");
const app = express();
const hbs = require("hbs");

app.listen(3000, () => {
  console.log("SERVER is good to go 🏍");
});

app.use(express.static(__dirname + "/public"));

app.set("view engine", "hbs");

//--------------------------------------
var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste your credentials here
var clientId = "6973ad3c761e4fd7b94516ce29d03bb9",
  clientSecret = "7c632a22ffd949749317066afc202d3d";
access_token = "";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.get("/", (request, response, next) => {
  response.render("home.hbs");
});

app.get("/artists", (request, response, next) => {
  spotifyApi
    .searchArtists(request.query.artist)
    .then(data => {
      //   response.send(data.body.artists.items);
      response.render("artists", { artists: data.body.artists.items });
    })
    .catch(err => {
      console.log("IT DIDN'T WORKED!!!!", err);
    });
  //     response.locals.searchTerm = search_query;
  //   response.render("artists.hbs");
});

app.get("/album/:albumId", (request, response, next) => {
  spotifyApi
    .getArtistAlbums(request.params.albumId)
    .then(data => {
      response.render("album", { album: data.body.items });
      //   response.render("albums", { albums: data.body.albums.items });
    })
    .catch(err => {
      console.log("IT DIDN'T WORKED!!!!", err);
    });
});
app.get("/tracks/:tracksId", (request, response, next) => {
  spotifyApi
    .getAlbumTracks(request.params.tracksId)
    .then(data => {
      //   response.send(data.body.items);
      response.locals.myTracks = data.body.items;
      response.render("tracks.hbs");
      //   response.render("tracks", { tracks: data.body.items });
      //   response.render("albums", { albums: data.body.albums.items });
    })
    .catch(err => {
      console.log("IT DIDN'T WORKED!!!!", err);
    });
});
