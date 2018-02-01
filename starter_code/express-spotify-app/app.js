const express = require("express");
const app = express();
var SpotifyWebApi = require("spotify-web-api-node");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

var clientId = "937a3426fde3443d93bed4984cdcf28b",
  clientSecret = "1fde40518aca48438e25b09db709302c";

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

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  // let searchInput = req.body.searchInput;
  let searchInput = 'Love';
  let resultSearchArtists, artistSearch;
  spotifyApi.searchArtists(searchInput) // 'Love'
    .then(
      function(data) {
        console.log(data.body.artists.items);
        resultSearchArtists = data.body.artists.items;
        for (let i = 0; i < resultSearchArtists; i++) {
          if (resultSearchArtists[i].name === searchInput) {
            artistSearch = resultSearchArtists[i];
          }
        }
      },
      function(err) {
        console.error(err);
      }
    );
  res.render("artists", artistSearch);
});

app.listen(3000);

// app.listen(3000, () => {
//   console.log('My first app listening on port 3000!');
// });
