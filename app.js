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
  res.render("index", {}); // second parameter information
}),
  app.get("/artist-search", (req, res) => {
    spotifyApi
      .searchArtists(req.query.searchInput) // search
      .then((data) => {
        // console.log(
        //   "The received data from the API: ",
        //   data.body.artists.items // answer
        // );
        res.render("searchResults", { items: data.body.artists.items });
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
    console.log(req.query);
  });

app.get("/albums/:id", (req, res) => {
  const albums = req.params.id;
  spotifyApi.getArtistAlbums(albums).then((match) => {
    console.log(match.body.items);
    res.render("albums", { albums: match.body.items });
  });
});

app.get("/tracks/:id", (req, res) => {
  const tracks = req.params.id;
  spotifyApi.getAlbumTracks(tracks).then((match) => {
    // console.log("this is tracks", match.body.items);
    res.render("tracks", { tracks: match.body.items });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
