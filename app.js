require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

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
  res.render("home");
});

app.get("/artist-search", (req, res, next) => {
  let artistObj = req.query;
  let artist = artistObj.artist;

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      let dataArtist = data.body.artists.items;
      console.log(artist);
      /* console.log(
        "The received artist from the API: ",
        data.body.artists.items
      );*/
      res.render("artist-search-results", { dataArtist });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      console.log("The received album from the API", data.body.items);
      let dataAlbum = data.body.items;
      res.render("albums", { dataAlbum });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:albumsId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumsId)
    .then((data) => {
      console.log("The received tacks from the API!!", data.body.items);
      let dataTracks = data.body.items;
      res.render("tracks", { dataTracks });
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
