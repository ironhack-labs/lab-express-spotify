require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const path = require("path");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
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

app.get("/", (req, res, next) => {
  return res.render("home");
});

app.get("/artist-search", (req, res, next) => {
  let artist = req.query.artist;

  console.log(artist);

  spotifyApi
    .searchArtists(artist) /*Here goes the query artist*/
    .then((data) => {
      let items = data.body.artists.items;
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );

  app.get("/albums/:artistId", (req, res, next) => {
    // .getArtistAlbums() code goes here
    let artistId = req.params.id;

    spotifyApi
      .getArtistAlbums(artistId)
      .then((data) => {
        let items = data.body.items;
        //console.log('Artist albums', items);
        res.render("albums", { albumArr: items });
      })
      .catch((err) =>
        console.log("The error while searching albums occurred: ", err)
      );
  });
  app.get("/track/:id", (req, res, next) => {
    let albumId = req.params.id;

    spotifyApi
      .getAlbumTracks(albumId)
      .then((data) => {
        let items = data.body.items;
        console.log("Artist albums", items);
        res.render("track", { albumArr: items });
      })
      .catch((err) =>
        console.log("The error while searching albums occurred: ", err)
      );
  });
});
app.listen(3003, () =>
  console.log("My Spotify project running on port 3003 🎧 🥁 🎸 🔊")
);
