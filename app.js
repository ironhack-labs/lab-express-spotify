require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Middleware for parsing the json and form-data requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
  //   console.log("requesting home page");
  res.render("index");
});

// get the tracks

app.get("/tracks/:albumId", (req, res) => {
  const albumId = req.params.albumId;
  console.log("albumId :>> ", albumId);

  spotifyApi.getAlbumTracks(albumId, { limit: 5, offset: 1 }).then(
    function (data) {
      const tracksArr = data.body.items;

      console.log("tracksArr :>> ", tracksArr);
      res.render("tracks", { track: tracksArr });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

// search by album id

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

// search
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
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
