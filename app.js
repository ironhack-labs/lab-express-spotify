require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  //"/artist-search" comes from the form <form action="/artist-search">, from index.hbs

  // return (
  spotifyApi
    .searchArtists(req.query.artist)
    //"query" is property of req
    //"artist" in req.query.artist comes from index.hbs, from name prop in name="artist"
    .then((data) => {
      // console.log("req.query.artist", req.query.artist);
      // res.json(data.body.artists);
      // console.log("data from the api", data);
      // console.log(data.body.artists.items[0]);
      res.render("artist-search-results", {
        dataFromApi: data.body.artists.items,
      });
    })
    .catch((err) => console.log("Error in searchArtists: ", err));

  // );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
