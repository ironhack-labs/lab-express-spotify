require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:
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

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here://///////////////////////////////////////

// Our routes go here:////////////////////////////////////////////////////////
app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      res.render("artist-search-results", data.body);
    })
    .catch((err) => {
      console.error("Error ", err);
    });
});

////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      console.log("Artist albums", data.body);
      res.render("albums", data.body);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/album/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      res.render("tracks", data.body);
    })
    .catch((err) => {
      console.error(err);
    });
});

///
// GET /
app.get("/", (req, res, next) => {
  res.render("home");
});
/*
// GET /pizzas
app.get("/", (req, res, next) => {
  // console.log(req.query); // req.query is an object
  // console.log(typeof req.query.maxPrice); // we will receive a string

  // const {maxPrice} = req.query; // using object destructuring

  let maximumPrice = req.query.maxPrice;
  maximumPrice = Number(maximumPrice); //convert to a number

  let filter = {};
  if (maximumPrice) {
    filter = { price: { $lte: maximumPrice } };
  }

  Pizza.find(filter)
    .then((pizzas) => {
      const data = {
        pizzasArr: pizzas,
      };

      res.render("product-list", data);
    })
    .catch((e) => console.log("error getting pizzas from DB", e));
});
*/
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
