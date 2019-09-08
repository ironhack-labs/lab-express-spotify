const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const clientId = "b93b082597aa4ac4a9a1315bfac4322f",
  clientSecret = "036e0f3a04224f849e294d5097a9a7c6";

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
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.query.q)
    .then(data => {
      // console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artists", data);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  //   spotifyApi.getArtistAlbums(req.params.artistId).then(
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function(data) {
      //   console.log("Artist albums", data.body.items[0]);
      res.render("albums", data);
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:albumId", (req, res) => {
  //   console.log("tracks ", req.params.albumId);
  spotifyApi.getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 }).then(
    function(data) {
      // console.log("Tracks", data.body.items[1].preview_url);
      res.render("tracks", data);
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
