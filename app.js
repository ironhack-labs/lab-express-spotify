require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies
app.use(bodyParser.json());

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

app.get("/artist-search", (req, res) => {
  console.log(req.query);
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items.images
      );
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      // res.render("artistSearch");
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
  // res.render("artistSearch");
});

app.post("/artist-search", (req, res) => {
  const artistName = req.body.artist;
});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums()
  // console.log("album query", req.query);

  const artistId = req.params.artistId;
  console.log("artistId:", artistId);
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      res.render("albums", { albums: data.body.albums.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

const port = 3000;
app.listen(port);
