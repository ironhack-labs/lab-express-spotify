const express = require("express");
const hbs = require("hbs");
const path = require("path")

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const clientId = "3f147b234dd947b68f69ffb78c8069df",
  clientSecret = "fb4723e1237145b8b8cd36958539cc3f";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get("/", function(req, res) {
  console.log("INDEX");
  res.render("index");
});

app.get("/artists", (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      let artistList = data.body.artist.items;
      res.render("artists", { artistList });
    })
    .catch(err => {
      console.log("an error occured!" + err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(
      function(data) {
        let albumsObj = data.body.items;
        res.render("albums", { albumsObj });
      },
      function(err) {
        console.error(err);
    });
});

app.get("/tracks/:trackId", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.trackId).then(
    function(data) {
      let tracksObj = data.body.items;
      res.render("tracks", { tracksObj });
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
