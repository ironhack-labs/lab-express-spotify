//Using Es6

//Packages
const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");

//Views config
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));

//Spotify Api credentials
const clientId = "6c4c1b57e7db440cb3737ea1eb4a401a";
const clientSecret = "8a7b26ca70dd4bc0a726ca459d465828";

let spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

//Retrieve an access token in es6
spotifyApi.clientCredentialsGrant().then(
  data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log("logged to spotify");
  },
  err =>
  console.log("Something went wrong when retrievinf an access token", err)
);

//Routes
app.get("/", (req, res) => {
  res.render("index");
});

//Artists route
app.post("/artists", (req, res) => {
  let artist = req.body.artist;
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      res.render("artists", {
        artists: data.body.artists.items
      });

    })
    .catch(err => {
      console.log("There was an error returning artist", err);
    });
});

//Get albums
app.get("/albums/:artistId", (req, res) => {
  let id = req.params;
  let lol = id.artistId;

  spotifyApi
    .getArtistAlbums(lol, {
      limit: 40,
      offset: 1
    })
    .then(data => {
      res.render("Albums", {
        albums: data.body.items
      });

    })
    .catch(err => {
      console.log("An error has ocurred", err);
    });
});

// //Get album tracks
// // Get tracks in an album
app.get("/tracks/:trackId", (req, res) => {
  let track = req.params;
  let trackId = track.trackId;


  //Api call
  // Get tracks in an album
  spotifyApi
    .getAlbumTracks(trackId, {
      limit: 30,
      offset: 0
    })
    .then(data => {
      res.render("tracks", {
        tracks: data.body.items
      });

    })
    .catch(err => {
      console.log("An error has ocurred", err);
    });
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));