const express = require("express");
const app = express();
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const clientId = "ece044927c3642299c65e922c8d8d4c2";
const clientSecret = "40b31b945f82417c9fa6a5849d3796f2";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

hbs.registerPartials(__dirname + "/views/partials");

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// the routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artists", (req, res) => {
  console.log(req.query.artistname);

  spotifyApi
    .searchArtists(req.query.artistname)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
      res.render("artists", { theArtists: data.body.artists.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  let artistId = req.query.id;
  console.log(req.query.artistId);
  spotifyApi.getArtistAlbums(req.query.artistId).then(
    function(data) {
      console.log("Artist albums", data.body.artistId.items);
      res.render("artists", { theArtists: data.body.artistId });
    },
    function(err) {
      console.error(err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
