const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const prettyjson = require("prettyjson");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Remember to insert your credentials here
const clientId = "86233a34f6824b7eabe300828579f493";
const clientSecret = "c8ecf6eed5df4d118252a69007cc270f";

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
  res.render("index.hbs");
});

app.get("/search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log(JSON.stringify(data.body));
      res.render("artists.hbs", { anghy: data.body.artists.items });
      console.log("The received data from the API: ", data.body);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(data => {
    res.render("albums.hbs", { albums: data.body.items });
  });
});

app.get("/album/tracks/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      // res.json(data.body.items);
      //console.log(prettyjson.render(data.body.items[0]));
      res.render("tracks.hbs", { tracks: data.body.items });
    })
    .catch(err => {
      console.log("error:", err);
    });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
