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

app.get("/home", function (req, res) {
  res.render("home");
});

//
// So, nothing is really working... I don't know if the error is here in the JS file, or if it is also in the hbs files. (There's probably errors everywhere!) I found it very difficult to understand how to access what I want to display in the views.
//

// Find artist:
app.get("/artist-search-results", function (req, res) {
  spotifyApi
    .searchArtists(req.query.text)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items); // data.body.artists.items[0].name   => shows one name, but how to get all the names??
      res.render("./artist-search-results", { data });
    })
    .catch((err) =>
      console.log("This error while searching artists occurred: ", err)
    );
});

// Show Albums:
app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      console.log(
        "Artist albums received from the API",
        data.body.artists.items
      ); // how to access the albums??
      res.render("albums", { data });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
