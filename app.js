require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

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

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Our routes go here:

app.get("/artist-search", (req, res) => {
  console.log(req.query);
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      console.log(
        "The received data from the API: ",
        //Items is also an array of object, you need to go into the items array to then display the image object and how they are structured
        data.body.artists.items[0].images
      );
      res.render("artist-search-results", {
        data: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(process.env.PORT, () =>
  console.log(
    `My Spotify project running on port ${process.env.PORT} 🎧 🥁 🎸 🔊`
  )
);
