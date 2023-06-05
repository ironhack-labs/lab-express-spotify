require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("hbs");
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID, //credentials we dont want to expose to public, this to ensure the credential is wrap by the env
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log("workded", data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

//
//
// Our routes go here:
//
//HOME
app.get("/", (req, res) => {
  res.render("home-page");
});
//
// Artist Search
app.get("/artist-search", (req, res) => {
  const filter = req.query.artistsSearchInput;
  console.log(filter);
  spotifyApi
    .searchArtists(filter)
    .then((artistsDataFromSpotifyApi) => {
      const artistsArr = artistsDataFromSpotifyApi.body.artists.items;
      //   console.log(
      //     "artistsArr type is",
      //     typeof artistsArr,
      //     "DETAILS",
      //     artistsArr
      //   );
      res.render("artist-search-results", { artistsArr });
    })
    .catch((e) => {
      console.log("FAIL TO SEARCH FOR ARTISTS", e);
    });
});
//
// Albums from Artist
app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((albumsDataFromSpotifyApi) => {
      const albumsArr = albumsDataFromSpotifyApi.body.items;
      res.render("albums", { albumsArr });
      //   console.log("ALBUM", albumsArr[0].images);
    })
    .catch((e) => {
      console.log("FAIL TO SEARCH FOR ALBUMS", e);
    });
});
//
// Tracks from Album
app.get("/tracks/:albumId", (req, res) => {
  console.log("tracks request");
  const albumId = req.params.albumId;
  spotifyApi.getAlbumTracks(albumId).then((tracksDataFromSpotifyApi) => {
    const tracksArr = tracksDataFromSpotifyApi.body.items;
    // console.log(tracksArr);
    res.render("tracks", { tracksArr });
    //       console.log("TRACKS", tracksDataFromSpotifyApi);
    //     })
    //     .catch((e) => {
    //       console.log("FAIL TO SEARCH", e);
  });
});
//
// Port
const port = 3000;
app.listen(port, () =>
  console.log(
    `My Spotify project running at http://localhost:${port}/ 🎧 🥁 🎸 🔊`
  )
);
