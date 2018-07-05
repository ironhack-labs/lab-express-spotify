const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");
const path = require("path");

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

hbs.registerPartials(__dirname + "/views/partials");

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

app.get("/", (req, res, next) => {
  res.render("home", {
    title: "Spotify"
  });
});

app.listen(3000);
