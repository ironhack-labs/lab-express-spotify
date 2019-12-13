require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token and search for Artists
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    //console.log(data.body["access_token"]);
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get("/", (req, res) => {
  // send the form to the user
  res.render("index");
});

app.get("/artists", (req, res) => {
  let artistData;

  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      //console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      artistData = data.body.artists.items;
      res.render("artists", { artistData });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  let albumData;
  // .getArtistAlbums() code goes here
  console.log(req.params.artistId);
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function(data) {
      console.log('Artist albums', data.body.items);
      albumData = data.body.items;
      res.render("albums", { albumData });
    },
    function(err) {
      console.error(err);
    }
  );

});

// Search for tracks

app.get("/tracks/:albumId", (req, res, next) => {
  let trackData;
  // .getArtistAlbums() code goes here
  console.log(req.params.artistId);
  spotifyApi.getAlbumTracks(req.params.albumId).then(
    function(data) {
      console.log('tracks', data.body.items);
      trackData = data.body.items;
      res.render("tracks", { trackData });
    },
    function(err) {
      console.error(err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
