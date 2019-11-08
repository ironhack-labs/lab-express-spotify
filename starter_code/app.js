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
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:

// the routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist", (req, res) => {
  const searchArtist = req.query.artistInput;
  spotifyApi
    .searchArtists(searchArtist)
    .then(data => {
      const options = {
        artistList: data.body.artists.items
      };
      //   res.send(data.body.artists.items);
      res.render("artists.hbs", options);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/artists/:artistId", (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      const options = {
        albumList: data.body.items
      };
      //   res.send(data);
      res.render("album.hbs", options);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/album/:albumId", (req, res) => {
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      const options = {
        tracklist: data.body.items
      };
      //   res.send(data);
      res.render("tracks.hbs", options);
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
