require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const port = 3000;
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
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

// home
app.get("/", (req, res, next) => {
  res.render("index.hbs");
});

// 404 page
app.get("*", (req, res, next) => {
  res.send(
    "404 error - Whatever it is that you are looking for... it ain't here."
  );
});

app.listen(port, () =>
  console.log(`My Spotify project 🏃 on port ${port} 🎧 🥁 🎸 🔊`)
);
