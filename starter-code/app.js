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

//Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search-results", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      console.log("The artist data from the API:", data.body.artists.items);
      const artistQuery = data.body.artists.items;
      res.render("artist-search-results", { artistQuery });
    })
    .catch(err =>
      console.log("The error while searching artist occured:", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  // : is used to indicate any information after the / -- see below params
  let artistId = req.params.artistId; // params is used to indicate information in the link -- see above :
  spotifyApi
    .getArtistAlbums(artistId, { limit: 20})
    .then(data => {
      console.log("The album data from the API:", data.body.items);
      const albumsQuery = data.body.items;
      res.render("albums", { albumsQuery });
    })
    .catch(err =>
      console.log("The error while searching artist occured:", err)
    );
});

app.get("/view-tracks/:albumId", (req, res, next) => {
  // : is used to indicate any information after the / -- see below params
  let albumId = req.params.albumId; // params is used to indicate information in the link -- see above :
  spotifyApi
    .getAlbumTracks(albumId, { limit: 20})
    .then(data => {
      console.log("The tracks data from the API:", data.body.items);
      const tracksQuery = data.body.items;
      res.render("view-tracks", { tracksQuery });
    })
    .catch(err =>
      console.log("The error while searching artist occured:", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
