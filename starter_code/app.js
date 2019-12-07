require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
// const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));

// require spotify-web-api-node package here:
// let clientId = "a990f90f30024a9eb3746df42c2f4bda",
//   clientSecret = "6f01b8dc62a44f93b9bf3559d1501c6a";
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// setting the spotify-api goes here:

// the routes go here:

app.get("/", (req, res, next) => {
  res.render("index");
});

//---------GET ARTISTS FROM DATA-BASE--------------
app.get("/artists", (req, res, next) => {
  let artist = req.query.artist;
  //Here we are getting the data from the input artist - we need to have the name="artist" in form
  // res.send(req.query.artists);

  spotifyApi
    .searchArtists(artist) //MISSING SOMETHING HERE!!!!
    .then(data => {
      // console.log("The received data from the API: ", data.body);
      let artists = data.body.artists.items;

      // console.log("artists", artists);
      res.render("artists", { artists, artist });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

//---------GET ALBUMS FROM ARTISTS--------------
app.get("/albums/:artistsId", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistsId).then(
    data => {
      console.log("Artist albums", data.body);
      res.render("albums", { albums: data.body.items });
    },
    function(err) {
      console.error(err);
    }
  );
});

//---------GET TRACKS FROM ALBUMS--------------
app.get("/tracks/:albumsId", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumsId).then(
    data => {
      console.log("Artist albums", data.body);
      res.render("tracks", { tracks: data.body.items });
    },
    function(err) {
      console.error(err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
