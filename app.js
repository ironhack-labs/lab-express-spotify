require("dotenv").config();

var morgan = require("morgan");

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

console.log(spotifyApi);

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

app.get("/", (req, res, next) => {
  console.log("index page reached");
  res.status(200).render("index");
});

app.get("/artist-search/", (req, res, next) => {
  console.log("artist search reached");
  const artist = req.query;
  console.log("str", artist.artist);
  spotifyApi
    .searchArtists(artist.artist)
    .then((data) => {
      console.log(artist);
      console.log(
        "The received data from the API: ",
        JSON.stringify(data.body)
      );
      res.render("artist-search-results", data.body.artists);
      // res.send(JSON.stringify(data.body));
      return;
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistID", (req, res, next) => {
  console.log("artist search reached");
  const artistID = req.params.artistID;
  console.log("str", artistID);
  spotifyApi
    .getArtistAlbums(artistID)
    .then((data) => {
      console.log(
        "The received data from the API: ",
        JSON.stringify(data.body)
      );
      // res.render("artist-search-results", data.body.artists);
      res.send(JSON.stringify(data.body));
      return;
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});
