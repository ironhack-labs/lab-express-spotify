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
  clientSecret: process.env.CLIENT_SECRET
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
  // this will render the template in /views/index.hbs
  res.render("index.hbs");
});

app.get("/artists", (req, res) => {
  console.log(req.query.artist);
  let artist = req.query.artist;
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      // console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artists.hbs", { output: data.body.artists.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;
  // .getArtistAlbums() code goes here
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      console.log("Artist albums", data.body.items);

      //res.send(data.body.items);
      let albums = data.body.items;
      res.render("albums.hbs", { albums });
    })
    .catch(err => {
      console.error(err);
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  const albumId = req.params.albumId;
  // .getArtistAlbums() code goes here
  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      console.log("Album tracks", data.body.items);

      //res.send(data.body.items);
      let tracks = data.body.items;
      res.render("tracks.hbs", { tracks });
    })
    .catch(err => {
      console.error(err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
