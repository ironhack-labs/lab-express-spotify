require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

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
  const { artist } = req.query; //request the query we have passed by typing sth in index.hbs
  spotifyApi
    .searchArtists(artist, { limit: 3 })
    .then((data) => {
      const artists = data.body.artists.items;
      console.log("The received data from the API: ", data.body.artists);
      res.render("artist-search-results", { artists });
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  //here we define what the params is called: artistID
  const { artistId } = req.params; //here we request that params we have defined
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albums = data.body.items;
      res.render("albums", { albums });
    })
    .catch((err) => console.log("Error while searching albums", err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
