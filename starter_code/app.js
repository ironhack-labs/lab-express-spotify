const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:

const clientId = "eb2a7b7fbc034e03b27da3cde7163d60",
  clientSecret = "423c35d2a90542e8b3e5b16fe17d77e3";

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

app.get("/", (req, res) => {
  res.render("index.hbs");
});

app.get("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.query.q)
    .then(data => {
      const artistList = data.body.artists.items;
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artists", { artistList });
      // console.log(data.body.artists.items);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(albums => {
      const albumList = albums.body.items;
      console.log("Artist albums", albums.body);
      res.render("albums", { albumList });
    })
    .catch(error => {
      console.error("Error loading Album");
    });
});

app.get("/tracks/:albumsId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumsId, {
      limit: 5,
      offset: 1
    })
    .then(track => {
      const trackList = track.body.items;
      res.render("tracks", { trackList });
    })
    .catch(error => {
      console.log("Something went wrong!", err);
    });
});

app.listen(3005, () =>
  console.log("My Spotify project running on port 3005 🎧 🥁 🎸 🔊")
);
