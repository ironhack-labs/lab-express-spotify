//#region Setup
var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

/// set view root folder and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerPartials(__dirname + "/views/partials");
//#endregion

//#region  Spotify API Setup
// Remember to paste here your credentials
var clientId = "4e671921b4e840faa5c584d37b13886f",
  clientSecret = "fe26440bb1824e8e9309161949348436";

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
//#endregion

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/artists", function(req, res) {
  console.log("DEBUG req.query.artist", req.query.artist);
  searchArtist(req.query.artist, res);
  let artist = req.query.artist;
});

app.get("/albums/:id", function(req, res) {
  let artistId = req.params.id;
  searchAlbums(artistId, res);
  // searchArtist(req.query.artist, res);
  // let artist = req.query.artist;
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));

function searchAlbums(artistId, res) {
  console.log("DEBUG searchAlbums ", artistId);
  spotifyApi.getArtistAlbums(artistId).then(data => {
    console.log(data.body.items[0].name);
    console.log(data.body.items[0].images);
    let albumArr = data.body.items.map(album => ({ name: album.name, img: album.images }));
    res.render("albums", { albums: albumArr });
  });
}

function searchArtist(artist, res) {
  // `q=name:${artist}&type=artist`
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      let artistsArr = data.body.artists.items.map((artist, index) => ({
        id: artist.id,
        name: artist.name,
        img: artist.images[0] ? artist.images[0].url : null
      }));
      res.render("artist", { artists: artistsArr });
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    });
}
