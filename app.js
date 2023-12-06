require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/artist-search", (req, res) => {
  console.log("artis search triggered");
  console.log(req.query.artist);

  spotifyApi
    .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/ req.query.artist)
    .then((data) => {
      //   console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", { myData: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/albums/:id", (req, res) => {
  //   console.log("req.params", req.params.id)
  console.log("album search triggered");
  spotifyApi.getArtistAlbums(req.params.id).then(
    function (data) {
      //   console.log("Artist albums", data.body.items);
      res.render("albums", { myData: data.body.items });
    },
    function (err) {
      console.error(err);
    }
  );
});
app.get("/tracks/:id", (req, res) => {
  console.log("track search triggered");
  console.log("req.params", req.params.id);
  spotifyApi.getAlbumTracks(req.params.id, { limit: 5, offset: 1 }).then(
    function (data) {
      console.log(data.body.items);
      res.render("tracks", { myData: data.body.items });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
