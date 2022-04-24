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
  console.log("A home req was made");
  res.render("home");
});

// Search for a artist and return an array with all data matching search criteria and display
app.get("/artist-search", (req, res) => {
  console.log("A search was made from the home page");
  spotifyApi
    .searchArtists(req.query.name)
    .then(artistSearched => {
      console.log(
        "A artist was retrieved from the DB",
        artistSearched.body.artists.items
      );
      res.render("artist-search", {artist: artistSearched.body.artists.items});
    })
    .catch((err) => {
      console.log("Error error error searching for artists in DB", err);
    });
});

// When a 'View Albums' link is clicked search for all albums from the artist and display
app.get("/artist-albums/:artistId", (req, res) => {
    console.log("a request to show the artist's albums has been made for this id", req.params);
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(artistAlbum => {
        console.log("the artist album details are", artistAlbum.body)
        res.render("artist-albums", {album: artistAlbum.body.items})
    })
    .catch((err) => {
        console.log("Error error error searching for albums in DB", err);
      });
})

//When a 'View Tracks' link is clicked search for all tracks from the artist and display
app.get("/artist-tracks/:albumId", (req, res) => {
    console.log("a request has been made to see the tracks from the alnum", req.params)
    spotifyApi.getAlbumTracks(req.params.albumId)
.then(albumTracks => {
    console.log("the album tracks are", albumTracks.body)
    res.render("album-tracks", {track: albumTracks.body.items})
})
.catch(err => console.log("Error errror error retrieving tracks from an album"))
})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
