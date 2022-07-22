require("dotenv").config();

const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

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
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  const query = req.query.artistName.toLowerCase();

  spotifyApi
    .searchArtists(query)
    .then((data) => {
      let artists = data.body.artists.items;
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", { artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/artist/:name", (req, res) => {
  const artistName = req.params.name;
  const artistId = req.query.id;
  spotifyApi.getArtistAlbums(`${artistId}`).then(
    function (data) {
      console.log("Artist albums", data.body);
      res.render("artist", { artistName, albums: data.body.items });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/album/:id", (req, res) => {
  const id = req.params.id;
  spotifyApi.getAlbum(id).then(
    function (data) {
      console.log("Album information", data.body.tracks);
      const albumInfo = data.body;
      const { artists, name, images, label, tracks } = albumInfo;
      res.render("album", {
        artists,
        name,
        label,
        image: images[0],
        tracks: tracks.items,
      });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.listen(4000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
