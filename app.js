require("dotenv").config();

const { query } = require("express");
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
//

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Our routes go here:

// Route to render the home page

app.get("/", (req, res) => {
  res.render("home");
});

// Route to search and display searched artist. From artist-search URL, search for artist, move to render page where showing result.
// Search Query has to be the same used in get form, input name.

app.get("/artist-search", (req, res) => {
  console.log("Searching artists");
  // console.log(req.query);
  let artistSearch = req.query.name; // add the query to a variable (name is equal to name used in the form)

  spotifyApi
    .searchArtists(artistSearch) // apply the variable artistSearch
    .then((data) => {
      let results = data.body.artists.items; // save the database info into a variable results
      console.log("The received data from the API: ", data.body);
      res.render("artist-search-results", { results });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Crate get route for search for albums.

app.get("/albums/:artistId", (req, res, next) => {
  console.log("Searching albums");
  const artistId = req.params.artistId; // put artistID into a variable

  spotifyApi
    .getArtistAlbums(artistId) // id variable
    .then((data) => {
      const albumResults = data.body.items; // save into a variable the database info
      console.log("The received data from the API: ", data.body);
      res.render("albums", { albums: albumResults }); // albums will be calle din the albumd.hbs to display name etc
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// create get route with albumID(used in the link view track on albums page).
// save to a variable named albumId the value of albumid using req.params
// use spotifyApi method, save to a variable the info database
//  use tracks to display info on tracks.hbs view

app.get("/tracks/:albumId", (req, res, next) => {
  console.log("Searching tracks");
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const trackResult = data.body.items;
      console.log("The received data from the API: ", data.body);
      res.render("tracks", { tracks: trackResult });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
