require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Setting up the Spotify API credentials
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log("Access token obtained");
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      res.render("artist-search-results", {
        artist,
        artists: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/artist-albums/:artistId", (req, res, next) => {
    const { artistId } = req.params;
  
    spotifyApi
      .getArtistAlbums(artistId)
      .then((data) => {
        
        console.log(data.body);
        res.send(data.body); 
  
        const albums = data.body.items;
        res.render("artist-albums", { albums }); 
      })
      .catch((err) => {
        console.log("Error fetching artist albums:", err);
        res
          .status(500)
          .send({ error: "An error occurred while fetching artist albums." });
      });
  });
  
  app.get("/tracks/:albumId", (req, res, next) => {
    const albumId = req.params.albumId;

    spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
        const tracks = data.body.items
        res.render("tracks", { tracks })
    })
    .catch(err => console.log("Error occured while searching tracks: ", err))
})

app.listen(3007, () =>
  console.log("My Spotify project running on port 3007 🎧 🥁 🎸 🔊")
);
