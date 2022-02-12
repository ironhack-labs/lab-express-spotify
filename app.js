require("dotenv").config();

const express = require("express");
const { render } = require("express/lib/response");
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

console.log(process.env.CLIENT_ID);
console.log(process.env.CLIENT_SECRET);

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  const { artistName } = req.query;
  console.log(artistName);
  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items[0]
      );

      const { items } = data.body.artists;
      return items;

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .then((allArtists) => res.render("artist-search-results", { allArtists }))
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res, next) => {
  const artistId = req.params.id;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((albums) => {
      const allAlbums = albums.body.items;
      res.render("albums", { allAlbums });
      console.log(allAlbums[0]);
    })
    .catch((err) => console.log(err));

  //
});

app.get("/tracks/:albumId", (req, res, next) => {
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((audioTracks) => {
      const allAudios = audioTracks.body.items;
      res.render("tracks", { allAudios });
      console.log(allAudios);
    })
    .catch((err) => console.log(err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
