require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
//   spotifyApi
//   .searchArtists(/artist-search)
//   .then(data => {
//     console.log('The received data from the API: ', data.body);
//     // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//   })
//   .catch(err => console.log('The error while searching artists occurred: ', err));

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Our routes go here:

// create the routes of the search
// app.get("/artist-search", (req, res) => {
//   spotifyApi
//     .searchArtists(artist - search)
//     .then((data) => {
//       console.log("The received data from the API: ", data.body);
//       // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//     })
//     .catch((err) =>
//       console.log("The error while searching artists occurred: ", err)
//     );
//   res.render("artist-search-results");
// });

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
