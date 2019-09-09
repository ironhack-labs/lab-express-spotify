// rsetup dorenv plackage
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
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artists", (req, res) => {
  const search = req.query.search;
  spotifyApi
    .searchArtists(search)
    .then(data => {
      const artists = data.body.artists.items;

      artists.forEach(artist => {
        if (!artist.images[0]) {
          artist.images.push({
            url:
              "https://media2.fishtank.my/app_themes/hitz/assets/images/default-album-art.png"
          });
        }
      });

      res.render("artists", { artistsList: artists });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  const artistsId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistsId)
    .then(data => {
      const albums = data.body.items;

      albums.forEach(albums => {
        if (!albums.images[0]) {
          albums.images.push({
            url:
              "https://media2.fishtank.my/app_themes/hitz/assets/images/default-album-art.png"
          });
        }
      });
      res.render("albums", { albumsList: albums });
    })
    .catch(error => {
      console.error("Error loading Album");
    });
});

app.get("/tracks/:albumsId", (req, res) => {
  const albumId = req.params.albumsId;
  spotifyApi
    .getAlbumTracks(albumId, {
      limit: 5,
      offset: 1
    })
    .then(track => {
      const tracks = track.body.items;
      res.render("tracks", { tracksList: tracks });
    })
    .catch(error => {
      console.log("Something went wrong!", err);
    });
});

app.listen(3005, () =>
  console.log("My Spotify project running on port 3005 🎧 🥁 🎸 🔊")
);
