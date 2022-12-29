// module that loads environment variables from a .env file into process.env
//         ^
//         |
require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
// this package will give you access to the methods to communicate to the DB that holds the data we need

// setting the spotify-api goes here:
// we are getting the info from th .env file (but it is being ignored by git)
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

// HBS will be in charge of rendering the HTML:
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// ***************************************************************
// ROUTES:
// ***************************************************************

// home route, ROUTE 1: DISPLAY THE FORM TO USERS SO THEY CAN SEARCH FOR THE ARTISTS
app.get("/", (req, res) => {
  res.render("home");
});

//search artist route, ROUTE 2: SUBMIT THE FORM
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((resultOfSearch) => {
      res.render("artist-search-results", {
        artists: resultOfSearch.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//search album route, ROUTE 3: THE DETAILS OF A SPECIFIC ARTIST BASED ON THE UNIQUE ID (WHICH GETS CAPTURED FROM THE URL)
// Get albums by a certain artist
app.get("/albums/:artistId", (req, res) => {
  // console.log("Id is: ", req.params.theId);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      res.render("albums", {
        albums: data.body.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(4000, () =>
  console.log("My Spotify project running on port 4000 🎧 🥁 🎸 🔊")
);
