const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const bodyParser = require ("body-parser")

var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste your credentials here
var clientId = "68e3087b69a04f129a0eecc1777d261e",
  clientSecret = "071105faded6467ea0342cc0a549d8f0";

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


app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);
hbs.registerPartials(`${__dirname}/views`);
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.render("index");
});

app.post("/artist", (req, res, next) => {
  spotifyApi.searchArtists(req.body.search)
    .then(data => {
      const items = data.body.artists.items
      res.render("artist", {items});
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
});

app.get('/albums/:artistId', (req, res) => {
  
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function(data) {
      const x = data.body.items;
      console.log('Artist albums', {x});
      res.render("albums", {x});
    },
    function(err) {
      console.error(err);
    }
  );
  
});

app.listen(3000);
