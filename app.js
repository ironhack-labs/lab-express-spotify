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
// main front homepage
app.get("/", (req, res) => {
  console.log(req.query);
  res.render("homepage");
});

// renders artist-search-results
app.get("/artist-search", (req, res) => {
  console.log(req.query);

  spotifyApi.searchArtists(req.query.artist).then(
    function (data) {
      console.log("The received data from the API: ", data.body.artists.items);
      res.render("artist-search-results", {
        artistsArray: data.body.artists.items,
      });
      //   below shows the data structure from DB
      //   res.send(data);
    },

    function (err) {
      console.error(err);
    }
  );
});

// view album page
app.get("/albums/:artistId", (req, res, next) => {
  //   spotifyApi.searchArtists(req.query.artist).then(
  //     function (data) {
  //       console.log("The received data from the API: ", data.body.artists.items);
  //       res.render("artist-search-results", {
  //         artistsArray: data.body.artists.items,
  //       });
  //       //   below shows the data structure from DB
  //       //   res.send(data);
  //     },

  //     function (err) {
  //       console.error(err);
  //     }
  //   );

  //   req.params is an object that contains the id
  console.log(req.params);
  // artistId is the value
  console.log(req.params.artistId);

  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function (data) {
      console.log("Artist albums", data.body.items);
      res.render("albums", {
        albumsArray: data.body.items,
      });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
