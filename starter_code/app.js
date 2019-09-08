const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const clientId = "eb2a7b7fbc034e03b27da3cde7163d60";
const clientSecret = "423c35d2a90542e8b3e5b16fe17d77e3";

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
  res.render("index");
});

app.get("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.query.q)
    .then(data => {
      res.render("artists", { artistsList: data.body.artists.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(albums => {
      res.render("albums", { albumsList: albums.body.items });
    })
    .catch(error => {
      console.error("Error loading Album");
    });
});

app.get("/tracks/:albumsId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumsId, {
      limit: 5,
      offset: 1
    })
    .then(track => {
      res.render("tracks", { tracksList: track.body.items });
    })
    .catch(error => {
      console.log("Something went wrong!", err);
    });
});

app.listen(3005, () =>
  console.log("My Spotify project running on port 3005 🎧 🥁 🎸 🔊")
);
