require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

// HBS will be in charge of rendering the HTML:
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

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

// Our routes go here:
// home route
app.get("/", (req, res, next) => {
  res.render("home");
});

//search artist route
app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists("Alyona Alyona")
    .then((resultOfSearch) => {
      const result = {
        artistName: resultOfSearch.body.artists.items[0]["name"],
        artistImage: resultOfSearch.body.artists.items[0].images[0]["url"],
        artistId: resultOfSearch.body.artists.items[0]["id"],
      };
      console.log(resultOfSearch.body.artists.items[0]["id"]);
      res.render("artist-search-results", result);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//search album route
app.get("/artist-search/:artistname", (req, res, next) => {
  spotifyApi
    .searchArtists(req.params.artistname)
    .then((resultOfSearch) => {
      const result = {
        artistName: resultOfSearch.body.artists.items[0]["name"],
        artistImage: resultOfSearch.body.artists.items[0].images[0]["url"],
        artistId: resultOfSearch.body.artists.items[0]["id"],
      };
      res.render("artist-search-results", result);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Get albums by a certain artist
app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums("artistId").then(
    (data) => {
      const result = {
        albumTitle: resultOfSearch.body.artists.items[0]["name"],
        albumCover: resultOfSearch.body.artists.items[0].images[0]["url"],
        artistId: resultOfSearch.body.artists.items[0]["id"],
      };
      res.render("album-search-results", data);
    },
    (err) => {
      console.error(err);
    }
  );
});

app.listen(4000, () =>
  console.log("My Spotify project running on port 4000 🎧 🥁 🎸 🔊")
);
