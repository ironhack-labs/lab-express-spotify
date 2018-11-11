var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");

//instacia del servidor express
const app = express();

//Configuraciones de express

hbs.registerPartials(__dirname + "/views/partials");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  let data = {
    artist: req.query.artist
  };
  res.render("index", data);
});

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(artist => {
      const data = {
        artists: artist.body.artists.items
      };
      res.render("artists", data);
    })
    .catch(err => {
      console.log("error API");
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  let { artistId } = req.params;

  spotifyApi
    .getArtistAlbums(artistId)
    .then(albums => {
      const data = {
        album: albums.body.items
      };
      res.render("albums", data);
    })
    .catch(err => {
      console.log("error API");
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  let { albumId } = req.params;

  spotifyApi
    .getAlbumTracks(albumId)
    .then(tracks => {
      const data = {
        track: tracks.body.items
      };
      res.render("tracks", data);
    })
    .catch(err => {
      console.log("error API");
    });
});

// ---------------------------SPOTIFY API CONFIGURATION------------------------
// Remember to paste your credentials here
var clientId = "0455a40d2ddf42958da47144bf4531e9",
  clientSecret = "ceab67dc5ef94d7aaafd198c3087a1e4";

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
// --------------------END----SPOTIFY API CONFIGURATION------------------------

//configuracion del puerto
const port = 3000;
app.listen(port, () => {
  console.log(`Ready on port ${port}`);
});
