const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const clientId = "cfaa79162e814532a23f854d07a59b55",
  clientSecret = "22abddfa419241ba856e6431d187d351";

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
//GET ARTISTS LIST
app.get("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.query.q)
    .then(data => {
      // const imgNumber = data.body.artists.items[0].images.length;
      // const randImg = Math.floor(Math.random() * Math.floor(imgNumber));
      // console.log(data.body.artists.items[0].images[randImg].url);

      res.render("artists", { artistsList: data.body.artists.items });
      // console.log(data.body.artists.items);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});
//GET ALBUMS LIST
app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render("albums", { albums: data.body.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});
//GET TRACK PREVIEW
app.get("/view_tracks/:albumsId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumsId, { limit: 5, offset: 1 })
    .then(data => {
      res.render("view_tracks", { tracks: data.body.items });
      console.log(data.body.items);
    })
    .catch(err => {
      console.log("The error while searching track occurred: ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
