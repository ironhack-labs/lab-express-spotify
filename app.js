require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(express.json());

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// unsure of this line
app.set("partials", "views" + "partials");

app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
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
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  let { artist } = req.query;

  if (artist.length > 0) {
    spotifyApi
      .searchArtists(artist)
      .then((data) => {
        let artists = data.body.artists.items;
        console.log(artists);
        res.render("artist-search-results", { artists });
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
  } else {
    console.log("Please enter a valid name!");
  }
});

// app.get("/artist-search/:artist", (req, res, next) => {});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
