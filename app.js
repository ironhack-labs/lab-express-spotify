require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const SpotifyWebApi = require("spotify-web-api-node");

// Middleware for parsing the json form-data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Our routes go here

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const data = req.query.artistName;
  //console.log(data);
  spotifyApi
    .searchArtists(data)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      //console.log(data.body.artists.items);
      const artists = data.body.artists.items;
      res.render("artist-search-results", { artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res) => {
  const id = req.params.id;
  spotifyApi.getArtistAlbums(id, { limit: 10, offset: 20 }).then(
    function (data) {
      console.log("Album information", data.body);
      res.render("albums", { albums: data.body.items });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:id", function (req, res) {
  const id = req.params.id;
  spotifyApi
    .getAlbumTracks(id)
    .then((data) => {
      // console.log('The received data from the API: ', data.body.items);
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
