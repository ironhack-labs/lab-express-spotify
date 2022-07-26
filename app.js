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
  res.render("home-page");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      // console.log("The received data from the API: ", data.body);
      // the following console displays an artist object, just to show that we can use its keys id, images[0] (just to get the first one) and name to pass the info to the next page
      // console.log(
      //   "The first object in the items array: ",
      //   data.body.artists.items[0]
      // );
      // // console.log(data.body.artists.items[0].id);
      const artists = data.body.artists.items;
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", { artists }); // pass data to the hbs file
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  // console.log("You want to see the albums of id: ", req.params);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      // console.log("Artist albums", data.body);
      const albums = data.body.items;
      const artistName = data.body.items[0].artists[0].name;
      // console.log("artistName: ", data.body.items[0].artists[0]);
      res.render("albums", {
        albums,
        artistName,
      });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

app.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId, { limit: 15, offset: 0 })
    .then((data) => {
      // console.log("The tracks: ", data.body);
      const tracks = data.body.items;
      res.render("tracks", { tracks });
    })
    .catch((err) => {
      console.log("Something wen wrong");
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
