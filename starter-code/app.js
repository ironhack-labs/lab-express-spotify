require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
app.get("/", (req, res) => res.render("index.hbs"));

app.get("/artist-search", (req, res) => {
  //console.log(req.query.search);
  spotifyApi
    .searchArtists(req.query.search)
    .then(data => {
      //   res.json(data.body);
      //   return;
      //   console.log("Received from the api:", data.body);
      res.render(
        "artist-search-results.hbs",
        { artists: data.body.artists.items } /*data.body.requested*/
      );
    })
    .catch(error => console.log(error));
});
//this.id
app.get("/albums/:id", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      //   res.json(data.body);
      //   return;
      //   console.log("Received from the api:", data.body);
      console.log("Received from the api:", data.body);
      res.render("albums.hbs", { albums: data.body.items });
    })
    .catch(error => console.log(error));
});

app.get("/tracks/:albId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albId)
    .then(data => {
      //   res.json(data.body);
      //   return;
      //     console.log("Received from the api:", data.body);
      //   console.log("Received from the api:", data.body);
      res.render("tracks.hbs", ("tracks", data.body));
    })
    .catch(error => console.log(error));
});

// Our routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
