require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

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

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.name)
    .then((data) => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items[0].images
      );

      let allTheArtists = data.body.artists.items;

      res.render("artist-search-results", { allTheArtists });
    })
    .catch((err) =>
      console.log("The error while searching artist occurred", err)
    );
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi 
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists);
    
      let allTheAlbums = data.body.artists.items;
    
      res.render("artist-search-results", {allTheAlbums});
    })
    .catch((err) =>
      console.log("The error while searching artist occurred", err));
}); 

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
