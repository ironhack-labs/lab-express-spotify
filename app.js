require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const path = require("path");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

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
//app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "public")));

//register partials
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  console.log(req.query);
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      console.log(
        "The received data from the API: ",
        //Items is also an array of object, you need to go into the items array to then display the image object and how they are structured
        JSON.stringify(data.body.artists.items[0].images, null, 2)
      );
      res.render("artist-search-results", {
        data: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  console.log(req.params);
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log(data.body);
      res.render("albums", {
        data: data.body.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/track/:albumId", (req, res) => {
  console.log(req.params);
  const { albumId } = req.params;
  spotifyApi
    .getAlbumTracks(albumId, { limit: 6, offset: 0 })
    .then((data) => {
      console.log(data.body);
      res.render("track", {
        data: data.body.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(process.env.PORT, () =>
  console.log(
    `My Spotify project running on port ${process.env.PORT} 🎧 🥁 🎸 🔊`
  )
);
