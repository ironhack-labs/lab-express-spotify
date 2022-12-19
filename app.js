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

// Route for home page :
app.get("/", (req, res, next) => {
  console.log("we received a request for the HOME page");

  res.render("home");
});

// Search route creation
app.get("/artist-search", (req, res, next) => {
  let artistName = req.query.artistName;
  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let artists = data.body.artists;

      res.render("artist-search-results", artists);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//GENERIC ROUTE FOR ALBUM DISPLAY

app.get("/albums/:artistId", (req, res, next) => {
  const idOfArtist = req.params.artistId;

  spotifyApi
    .getArtistAlbums(idOfArtist)
    .then((dataFromDB) => {
      const albumsOfArtist = dataFromDB.body;

      if (dataFromDB === null) {
        res.send("Sorry,page does not exist");
      } else {
        res.render("albums", albumsOfArtist);
      }
    })
    .catch((error) => {
      console.log("error...", error);
    });
});

//GENERIC ROUTE FOR TRACK DISPLAY

app.get("/tracks/:trackId", (req, res, next) => {
  const idOfTrack = req.params.trackId;

  spotifyApi
    .getAlbumTracks(idOfTrack, { limit: 6, offset: 1 })
    .then((dataFromDB) => {
      const tracks = dataFromDB.body;

      if (dataFromDB === null) {
        res.send("Sorry,page does not exist");
      } else {
        res.render("tracks", tracks);
      }
    })
    .catch((error) => {
      console.log("error...", error);
    });
});



/////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
