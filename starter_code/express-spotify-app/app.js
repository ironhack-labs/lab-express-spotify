const express = require("express");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require('body-parser');

const app = express();
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste here your credentials
var clientId = "ae8761a9adb544fc9a5becdb1aa9947e",
  clientSecret = "6c56357587974ad99978d76b104b356e";

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

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist", (req, res) => {
  let artistQuery = req.query.artist;
  spotifyApi.searchArtists(artistQuery)
    .then(artist => {
      let artistArray = [];
      artist.forEach(artist =>
       artistArray.push(artist.name)
      );
      console.log(artist);
      res.render("artist",{artist});
    })
    .catch(err => {
      console.log(err);
    })
});

const port = 3333;
app.listen(port, () => console.log(`the port is ${port}`));
