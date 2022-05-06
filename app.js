require("dotenv").config();

const SpotifyWebApi = require("spotify-web-api-node");

const express = require("express");
const hbs = require("hbs");

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

// setting the spotify-api goes here:

// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  
  /* console.log(req.query); */

  const { search } = req.query;

  spotifyApi
    .searchArtists(search)
    .then((data) => {

      
      res.render("artist-search-results.hbs", {artists:data.body.artists.items});
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );

    app.get("/albums/:artistId", (req, res, next) => {
      /* res.render("/"); */
      
      spotifyApi
      .getArtistAlbums();
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
