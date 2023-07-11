require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    console.log({body: data.body})
    spotifyApi.setAccessToken(data.body["access_token"])
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const artist = req.query.artist;

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      const artists = data.body.artists.items;
      res.render("search", { artists });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albums = data.body.items;
      res.render("albums", { albums });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/tracks/:albumId", (req, res) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const tracks = data.body.items;
      res.render("tracks", { tracks });
    })
    .catch((err) => {
      console.log("The error while retrieving tracks occurred: ", err);
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
