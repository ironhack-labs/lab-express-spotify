require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

//Middleware
//

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log("worked", data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// setting the spotify-api goes here:
app.get("/", (req, res, next) => {
  res.render("index");
});

// Our routes go here:
app.get("/", (req, res) => {
  //   console.log("requesting home page");
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const artistSearch = req.query.artistSearch;
  //   console.log("artistSearch :>> ", artistSearch);

  spotifyApi
    .searchArtists(artistSearch)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      const artistsList = data.body.artists.items; // array

      res.render("artist-search-results", { artistsResults: artistsList });

      const artistImg = artistsList;
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;

  spotifyApi.getArtistAlbums(artistId).then(
    (data) => {
      const album = data.body.items;
      res.render("albums", { album: album });
    },
    function (err) {
      console.error(err);
    }
  );
});
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
