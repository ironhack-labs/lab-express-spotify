const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const bodyparser = require("body-parser");

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));

hbs.registerPartials(path.join(__dirname, "views/partials"));

const clientId = "9b2f2eda8a824a01a67f3bd272d1191d",
  clientSecret = "f2092c65231444e799c1547220186feb";

const spotifyApi = new SpotifyWebApi({
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

// Home page
app.get("/", (req, res, next) => {
  res.render("home", {
    title: "Spotify"
  });
});

// Artist page
app.post("/artists", (req, res, next) => {
  var { artist } = req.body;

  spotifyApi.searchArtists(artist)
    .then(data => {
      var artists = data.body.artists.items;

      artists.forEach(element => {
        if (element.images.length > 1) {
          element.imageUrl = element.images[1].url;
        } else if (element.images.length) {
          element.imageUrl = element.images[0].url;
        } else {
          element.imageUrl = "http://cdn.onlinewebfonts.com/svg/img_508643.png";
        }
      });

      res.render("artists", {
        title: "Artists - Spotify",
        artists: artists
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(3000);
