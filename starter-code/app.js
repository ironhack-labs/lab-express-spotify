require("dotenv").config();

// express packages
const express = require("express");

// handlebar package
const hbs = require("hbs");
hbs.registerPartials(__dirname + "/views/partials");

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
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log("Token retrieved");
    console.log("The access token is " + spotifyApi.getAccessToken());
    console.log("The client ID is " + spotifyApi.getClientId());
  })

  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (request, response) => {
  console.log("/");
  response.render("index.hbs");
});

app.get("/", (request, response) => {
  console.log("/");
  response.render("artist-search-results.hbs");
});

// ------------------ Artist search
app.get("/artist-search", (request, response) => {
  //  console.log("request.query: ", request.query);
  console.log("Artist searched...");
  spotifyApi
    .searchArtists(request.query.artist)
    .then(data => {
      //  console.log("The received ARTIST data from the API: ", data.body.artists);
      response.render("artist-search-results.hbs", {
        result: data.body
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// ------------------ Album search
app.get("/albumView", (request, response) => {
  // console.log("request.query: ", request.query);
  console.log("Albums searched...");
  spotifyApi
    .getArtistAlbums(request.query.id)
    .then(data => {
      // console.log("The received ALBUM data from the API: ", data.body);
      response.render("albumView.hbs", {
        result: data.body
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// ------------------ Songs search
app.get("/songsView", (request, response) => {
  //console.log("request.query: ", request.query);
  console.log("Songs searched...");
  spotifyApi
    .getAlbumTracks(request.query.id)
    .then(data => {
      // console.log("The received SONG data from the API: ", data.body);
      response.render("songsCard.hbs", {
        result: data.body
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// ------------------ start app

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
