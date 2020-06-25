require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

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
app.get("/", (req, res) => res.render("index"));
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      // console.log('The received data from the API: ', data.body.artists.items[0].images);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", { data: data.body });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/albums/:id", (req, res) => {
  console.log(req.params.id);
  spotifyApi.getArtistAlbums(req.params.id)
  
  .then((data) => {
    res.render("album", { data: data.body });
    console.log('Imagenes de los albums: ', data.body/*.items[0].images[0].url*/)
  })
  .catch((err) =>
  console.log("The error while searching albums occurred: ", err)
)
});

app.get("/albums/tracks/:id", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id)
  .then((data) => {
    res.render("tracks", { data: data.body });
    //console.log('Tracks de los albums: ', data.body)
  })
  .catch((err) =>
  console.log("The error while searching tracks occurred: ", err)
)
});
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
