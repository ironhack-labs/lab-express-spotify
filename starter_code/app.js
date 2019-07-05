const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const clientId = "d937cdde8a05438493a82da6ec264ce7",
  clientSecret = "619734c88397416cb3583270227c18ff";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      //   console.log("The received data from the API: ", data.body);
      //   console.log(data.body.artists.items[0]);
      res.render("artists", { artists: data.body.artists.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      //   console.log("The received data from the API: ", data.body);
      //   console.log(data.body.items[0]);
      res.render("albums", { albums: data.body.items });
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      //   console.log("The received data from the API: ", data.body);
      console.log(data.body.items[0]);
      res.render("tracks", { tracks: data.body.items });
    })
    .catch(err => {
      console.log("The error while searching tracks occurred: ", err);
    });
});
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
