require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const path = require("path");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", function (req, res) {
  res.render("index");
});

app.get("/artistSearch", (req, res) => {
  console.log(req.query);
  spotifyApi
    .searchArtists(req.query.artistSearch)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items[0].images);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", { artist: data.body.artists.items});
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId, {limit:5})
    .then((data) => {
        console.log(('It is the real album:', data.body));
        res.render('albums', {album: data.body.items})
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
  });

  app.get('/tracks/:artistId', (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.artistId, {limit:5})
    .then((data) => {
        console.log(('It is the real tracks:', data.body.items));
        res.render('tracks', {tracks: data.body.items})
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
  });
// agregamos esta línea para poder tener acceso a los datos de req.body

/* app.use(express.urlencoded({ extended: true })); */

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
