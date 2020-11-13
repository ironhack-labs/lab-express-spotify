require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
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
app.get("/", (req, res) => {
  res.render("index");
});
//step 2 display results for artist
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items[0].images[0]
      );
      res.render("artist-search-results.hbs", {
        artistsData: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/albums/:id", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id, { limit: 5 })
    .then((data) => {
      console.log(data.body.items);
      res.render("albums", { albums: data.body.items });
    })
    .catch((error) => {
      console.log(error);
    });
});
//get tracks
app.get("/tracks/:id", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.id, { limit: 5 })
    .then((data) => {
      console.log(data.body.items);
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((error) => {
      console.log(error);
    });
});
// end
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
