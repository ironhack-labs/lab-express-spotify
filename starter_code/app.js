const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const clientId = "d6ece541d3114c52af33f94e46251f93",
  clientSecret = "ae300516785845e3ae2790fb752e21fe";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      res.render("artists", { artists: data.body.artists.items });
      //   console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:id", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id).then(
    function(data) {
      //   console.log("Artist albums", data.body.items);
      res.render("albums", { albums: data.body.items });
      //   res.send(data.body.items[0].artists[0].name);
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:id", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id).then(
    function(data) {
      console.log("Album Tracks", data.body.items);
      res.render("tracks", { tracks: data.body.items });
      //   res.send(data.body.items[0].artists[0].name);
    },
    function(err) {
      console.error(err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
