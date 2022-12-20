require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
hbs.registerPartials(__dirname + "/views/partials");
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
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
// Retrieve an access token

// Our routes go here:
app.get("/", (req, res, next) => {
  console.log("homepage request");
  res.render("homepage");
});

app.get("/artist-search", (req, res, next) => {
  // res.send(req.query.artist);
  const artist = req.query.artist;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      const artistsArr = data.body.artists.items;
      const arrayOfArtists = [];
      for (let i = 0; i < artistsArr.length; i++) {
        if (artistsArr[i].images.length > 0) {
          arrayOfArtists.push({
            name: artistsArr[i].name,
            image: artistsArr[i].images[0].url,
            id: artistsArr[i].id,
          });
        } else {
          arrayOfArtists.push({
            name: artistsArr[i].name,
            id: artistsArr[i].id,
          });
        }
      }
      res.render("artist-search-results", { arrayOfArtists });
    })
    .catch((err) => console.log(err));
});

app.get("/albums/:artistID", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistID).then((data) => {
    const albumsArr = data.body.items;
    const albumDetailsArr = [];
    for (let i = 0; i < albumsArr.length; i++) {
      albumDetailsArr.push({
        albumName: albumsArr[i].name,
        albumImage: albumsArr[i].images[0].url,
        albumID: albumsArr[i].id,
      });
    }
    res.render("albums", { albumDetailsArr });
  });
});

app.get("/albums/:albumID/tracks", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumID).then((data) => {
    const tracksArr = data.body.items;
    const arrayOfTracks = [];
    for (let i = 0; i < tracksArr.length; i++) {
      arrayOfTracks.push({
        name: tracksArr[i].name,
        previewurl: tracksArr[i].preview_url,
      });
    }
    res.render("tracks", { arrayOfTracks });
  });
});

app.listen(3001, () =>
  console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊")
);
