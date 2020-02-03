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
  console.log("/");
  response.render("index.hbs");
});

app.get("/artist-search", (request, response) => {
  const userInput = request.query.artist;

  spotifyApi
    .searchArtists(userInput)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
      response.render("artist-search-results.hbs", {
        artistList: data.body
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (request, response) => {
  console.log("request.params", request.params.artistId);

  spotifyApi
    .getArtistAlbums(request.params.artistId)
    .then(something => {
      console.log(something.body.items);
      response.render("albums.hbs", { albumList: something.body.items });
    })

    .catch(err => console.log(err));
});

app.get("/tracks/:albumID", (request, response) => {
  let albumId = request.params.albumID; //albumID links to route on line 64 :albumID
  console.log(albumId);
  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      response.render("tracks.hbs", { tracksList: data.body.items });
    })

    .catch(err => console.log(err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
