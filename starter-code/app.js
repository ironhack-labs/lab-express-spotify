require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const path = require("path");
// require spotify-web-api-node package here:

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: "http://localhost:3000"
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
/* GET home page */
app.get("/", (req, res) => res.render("index"));

app.get("/artist-search", (req, res) => {
  //   console.log(req.query.artist);
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      //   console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-result", {
        info: data.body.artists.items
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/albums/:artistId", (req, res, next) => {
  //   console.log(req.params.artistId);

  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(response => {
      //   console.log("The received data from the API: ", response.body.items);
      res.render("albums", { info: response.body.items });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/tracks/:albumId", (req, res, next) => {
  console.log(req.params.albumId);

  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(response => {
      console.log("The received data from the API: ", response.body.items);
      res.render("tracks", { info: response.body.items });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});
// spotifyApi.getArtistAlbums();
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
