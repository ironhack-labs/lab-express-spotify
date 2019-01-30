const express = require("express");
const hbs = require("hbs");
const path = require("path")

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const clientId = "3f147b234dd947b68f69ffb78c8069df",
  clientSecret = "fb4723e1237145b8b8cd36958539cc3f";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get("/", function(req, res) {
  res.render("index");
});

app.get("/artists", (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render("artists", {  
        artists: data.body.artists.items
      });
    })
    .catch(err => {
      console.log("an error occured!" + err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(
      data => {
        console.log("The received data from the API ALBUM: ", data.body)
        res.render("albums", { 
          albums: data.body.items
        });
    });
});

app.get("/tracks/:trackId", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.trackId).then(
    data => {
      "The received data from the API ALBUM: ", data.body
      res.render("tracks", { 
        tracks: data.body.items
      });
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
