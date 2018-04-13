const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");

/*CONFIG EXPRESS*/

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));
console.log(__dirname + "public");
hbs.registerPartials(__dirname + "/views/partials");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.render("index");
});

//Remember to paste here your credentials
var clientId = "73e3b1ab2b874ef98bf693131ec78453",
  clientSecret = "88d8a8d1695d41a48b5bd693586f24d0";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.post("/artist", (req, res) => {
  spotifyApi
    .searchArtists(req.body.artist)
    .then(data => {
      const artist = {
        list: data.body.artists.items
      };
      res.render("artist", artist);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  //console.log(req.params.artistId);
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function(data) {
      console.log(data.body.items);
      const artist = {
        list: data.body.items
      };
      //console.log(artist.list)
      res.render("album", artist);
      // console.log('Albums information', data.body);
    },
    function(err) {
      console.error(err);
    }
  );
});

/*TRACKS*/
app.get("/songs/:artistId", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.artistId, { offset: 1 }).then(
    function(data) {
      // console.log(data.body)
      const songs = {
        list: data.body.items
      };
      // console.log(songs)
      res.render("song", songs);
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000);
