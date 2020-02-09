require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
//hbs.registerPartials('views', __dirname + 'views')
// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
const app = express();

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  console.log("req.query :", req.query);
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      const artistObj = data.body.artists.items;
      res.render("artist-search-results", { artistObj });
    })
    .catch(err => {
      console.log("err :", err);
    });
});

app.get("/albums/?:id", (req, res, next) => {
  const artistID = req.params.id;
  spotifyApi
    .getArtistAlbums(`${artistID}`)
    .then(data => {
      const albumObj = data.body.items;
      res.render("album", { albumObj });
    })
    .catch(err => {
      console.log("err :", err);
    });
});

app.get("/album/tracks/?:id", (req, res, next) => {
  const albumID = req.params.id;
  spotifyApi
    .getAlbumTracks(`${albumID}`)
    .then(result => {
      const trackObj = result.body.items;
      console.log("trackObj[0] :", trackObj);
      res.render("tracks", { trackObj });
    })
    .catch(err => {
      console.log("err :", err);
    });
});

app.listen(3002, () =>
  console.log("My Spotify project running on port 3002 🎧 🥁 🎸 🔊")
);
