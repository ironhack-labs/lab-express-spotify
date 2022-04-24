require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");
// require spotify-web-api-node package here:

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

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/:artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artists)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      res.render("artist-search-result", { artist: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId, { limit: 10 })
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      res.render("albums", { arrOfAlbums: data.body.items });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/tracks/:tracksId", (req, res, next) => {
  spotifyApi;
  spotifyApi
    .getAlbumTracks(req.params.tracksId, { limit: 5, offset: 1 })
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      res.render("tracks", { arrOfTracks: data.body.items });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
