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

// console.log(process.env.CLIENT_ID);
// console.log(process.env.CLIENT_SECRET);

// Retrieve an access token
spotifyApi.clientCredentialsGrant().then((data) => {
  spotifyApi.setAccessToken(data.body["access_token"]);
  //console.log("Api is cool");
});

// .then(() => {
//   spotifyApi
//     .searchArtists()
//     .then((data) => {
//       console.log(
//         "The received data from the API: ",
//         data.body.artists.items
//       );
//       // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//     })
//     .catch((err) =>
//       console.log("The error while searching artists occurred: ", err)
//     );
// })

// .catch((error) =>
//   console.log("Something went wrong when retrieving an access token", error)
// );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home-page");
});

app.get("/artist-search", (req, res) => {
  const artistName = req.query.artistName;
  //console.log("huuuhhhhhh", req.query);
  //const { search } = req.query;

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      // console.log(
      //   "The received data from the ARTIST API: ",
      //   data.body.artists.items
      // );
      const artists = data.body.artists.items;
      res.render("artist-search-results", { artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  //console.log("Data????", req.params.artistId);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      // console.log("The received data from the ALBUMS API: ", data.body);
      const albums = data.body.items;
      res.render("albums", { albums });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res, next) => {
  console.log("tracks???", req.params.albumId);
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      console.log("The recieved data from the TRACKS API", data.body);
      const tracks = data.body.items;
      res.render("tracks", { tracks });
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
