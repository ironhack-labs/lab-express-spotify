require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

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

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Our routes go here:
app.get("/", function (req, res) {
  res.render("index");
});

// artist search
app.get("/artist-search", function(req, res) {
    console.log(req.query)
    const queryArtist = req.query.q
 spotifyApi
  .searchArtists(queryArtist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists);
  res.render("artist-search-results" , {artists: data.body.artists.items})
})
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

// album search
app.get("/albums/:artistId", (req, res) => {
    const id = req.params.artistId;
    console.log(id);
    spotifyApi
      .getArtistAlbums(id)
      .then((data) => {
        console.log(data.body.items);
        const albums = data.body.items;
        res.render("albums", { albums });
      })
      .catch((err) => console.log("An error while searching albums occured:", err));
  });

  app.get("/tracks/:trackId", (req, res) => {
    const id = req.params.trackId;
    console.log(id);
    // Get tracks in an album
    spotifyApi
      .getAlbumTracks(id)
      .then((data) => {
        console.log("tracks are displayed here:");
        console.log(data.body.items);
        const tracks = data.body.items;
        tracks.forEach((track) => console.log(track.name));
        // res.send("getting tracks");
        res.render("tracks", { tracks });
      })
      .catch((err) => console.log(err));
  });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
