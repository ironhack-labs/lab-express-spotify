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
app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      console.log(data.body.artists.items[1].id);
      //this creates an object which stores the list of items from the API we've narrowed down to as a value of the property 'artists'
      const artistsFromApi = {artists: data.body.artists.items};
      res.render("artist-search-result", artistsFromApi);
    })
    .catch((err) => console.log(err));
});

app.get("/albums/:artistID", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistID)
    .then((data) => {
      //console.log(data.body.items)
      const foundAlbums = { albums: data.body.items };
      res.render("albums", foundAlbums);
    })
    .catch((err) => console.log(err));
});



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
