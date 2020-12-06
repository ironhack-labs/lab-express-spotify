require("dotenv").config();

const express = require("express");
const app = express();
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

// setting the spotify-api:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

//route Home
app.get("/", (req, res) => {
  res.render("home");
});

// route to get the artist from the Form search
app.get("/artist-search", (req, res) => {
  //   console.log(req.query.artist);
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body);

      const database = data.body.artists.items;
      //   console.log("The API send those info", database);
      res.render("artist-search-results", { database });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//route to view albums
app.get("/albums/:artistId", (req, res) => {
  // Get an artist
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function (data) {
      const listOfAlbum = data.body.items;
      console.log("this is the result", listOfAlbum);
      res.render("albums", { listOfAlbum });
    },
    function (err) {
      console.error(err);
    }
  );
});

// route to  view track
app.get("/albums/tracks/:trackId", (req, res) => {
  // Get tracks in an album
  spotifyApi.getAlbumTracks(req.params.trackId).then(
    function (data) {
      console.log(data.body.items);
      const tracksOfAlbum = data.body.items;
      res.render("tracks", { tracksOfAlbum });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

// app.listen(process.env.PORT, () => {
//     console.log("http://localhost:" + process.env.PORT);
//   });
