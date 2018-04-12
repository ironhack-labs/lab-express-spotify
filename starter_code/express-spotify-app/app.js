const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const SpotifyWebApi = require("spotify-web-api-node");

hbs.registerPartials(__dirname + "/views/partials");

const clientId = "67dbae35cdef44c8a84c49cc91827db4",
  clientSecret = "b156016d45c54a7c8ae643a23360fc5f";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", `${__dirname}/views`);
app.set("view engine", "hbs");

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

let artist;

app.get("/", (req, res) => {
  artist = req.query;
  res.render("index");
});

app.get("/artist", (req, res) => {
  
  artist = req.query.artist
  spotifyApi
    .searchArtists(artist)
    .then(artist => {
      let data = {
        artists :  artist.body.artists
      }
      // console.log(data.artists.items.images);
      data.artists.items.forEach(element => {
        console.log(element.images)
      });
      res.render("artist", data);
    })
    .catch(err => {
      console.log(err);
    });
});

const port = 3000;
app.listen(port, () => console.log(`Conected to port ${port}`));
