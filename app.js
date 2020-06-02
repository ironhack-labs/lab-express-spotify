require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

//Use body parser. To be able parse post request information
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

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
  res.render(__dirname + "/views/home.hbs");
});

app.post("/artist-search", (req, res) => {
  console.log(req.body);
  spotifyApi
    .searchArtists(req.body.search)
    .then((data) => {
      //console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const {
        artists: { items },
      } = data.body;
      let itemsWithImages = items.filter((item) => {
        return item.images.length;
      });
      res.render("artist-search-results.hbs", { itemsWithImages });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)

    .then((albums) => {
      let artistAlbums = albums.body.items;
      //console.log(artistAlbums)
      res.render("albums.hbs", { artistAlbums });
    })
    .catch(() => {
      console.log("there is an error");
    });
});

app.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((tracks) => {
      let albumTracks = tracks.body.items;
      console.log(tracks.body.items);
      res.render("tracks.hbs", { albumTracks });
    })
    .catch(() => {
      console.log("YOU FUCKED IT UP");
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
