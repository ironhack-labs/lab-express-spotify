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
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  console.log("/");
  res.render("index.hbs");
});

//GETTING THE ARTISTS
app.get("/artist-search", (req, res) => {
  console.log("/artist-search");
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      //   console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results.hbs", {
        data: data.body.artists.items
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//GETTING THE ALBUMS
app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      //   res.send(data);
      res.render("albums.hbs", {
        data: data.body.items
      });
    })
    .catch(err =>
      console.log("The error while searching albums occurred: ", err)
    );
});

//GETTING THE TRACKS
app.get("/tracks/:albumId", (req, res) => {
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      //   console.log(data.body.items.name);
      //   res.send(data.body.items);
      res.render("tracks.hbs", {
        data: data.body.items
      });
    })
    .catch(err =>
      console.log("The error while searching tracks occurred: ", err)
    );
});

app.listen(3002, () =>
  console.log("My Spotify project running on port 3002 🎧 🥁 🎸 🔊")
);