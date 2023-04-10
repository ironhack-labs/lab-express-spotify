require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

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
app.get("/", function (req, res, next) {
  res.render("homepage", {});
});

app.get("/artist-search", (req, res, next) => {
    // 1. faire un call a l'api Spotify pour retrouver les artistes matchant ce que l'utilisateur a tapé
    const artist = req.query.q;
    console.log(artist)

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
        const artists = data.body.artists.items

      console.log("The received data from the API: ", artists);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      
      res.render("artist-search", { artists, artist });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});



app.get("/albums/:artistId", (req, res, next) => {
    spotifyApi
      .getArtistAlbums(req.params.artistId)
      .then((data) => {
        const albums = data.body.items;
        console.log('Artist albums', albums);

        const artistName = req.query.artistName;
        res.render("albums", { albums, artistName });
      })
      .catch((err) =>
        console.log("The error while getting albums occurred: ", err)
      );
  });

  app.get("/tracks/:artistId", (req, res, next) => {
    spotifyApi
      .getAlbumTracks(req.params.artistId)
      .then((data) => {
        const tracks = data.body.items;
        console.log('Artist albums', tracks);

        const albumName = req.query.albumName
        res.render("tracks", { tracks, albumName });
      })
      .catch((err) =>
        console.log("The error while getting tracks occurred: ", err)
      );
  });

  

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
