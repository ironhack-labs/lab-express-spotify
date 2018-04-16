const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

hbs.registerPartials(path.join(__dirname, "views", "partials"));

const clientId = "3bf666e055684c42bc6eaa9789b34e37",
  clientSecret = "578bb2451be04f34aa57767599d67f86";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function (data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function (err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

let pageData = {
  pageTitle: ""
};

app.get("/", (req, res, next) => {
  pageData = {
    pageTitle: "Home"
  };

  res.render("home", pageData);
});

app.post("/artists", (req, res) => {
  let {
    artistName
  } = req.body;

  spotifyApi
    .searchArtists(artistName)
    .then(data => {
      let artistsList = data.body.artists.items;
      /* console.log(data.body.artists.items[0].images[0]); */

      pageData = {
        pageTitle: "Artists",
        artistsList: artistsList
      };

      res.render("artists", pageData);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/albums", (req, res) => {

  let artistID = req.query.artistID;
  let artistName = req.query.artistName;

  spotifyApi.getArtistAlbums(artistID).then(data => {

      pageData = {
        pageTitle: "Albums",
        artistAlbums: data.body.items,
        artistName: artistName
      };

      res.render("albums", pageData);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/tracks", (req, res) => {

  let albumID = req.query.albumID;
  let albumName = req.query.albumName;

  spotifyApi.getAlbumTracks(albumID).then(data => {

      pageData = {
        pageTitle: "Albums",
        name: albumName,
        tracks: data.body.items
      };

      res.render("tracks", pageData);
    })
    .catch(err => {
      console.log(err);
    });
});

const port = 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));