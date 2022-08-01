require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

// Retrieve an access token
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Retrieving an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
// Our routes go here:

// Homepage, that renders a small search with a button that receives a form with a search bar for the artist name and a submit button
// It querys through the action and it is submitted to the /artist-search, in the API of spotify
app.get("/", (req, res) => {
  res.render("search");
});

// Displaying results from the artist search
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist) //creating a request that receives the query string of an artist
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      // After receiving data from the body, we render the results of the artists in the artist page
      res.render("artists-search-results", {
        // So for every search you do, we are rendering from the data received for all albums of the artist
        artists: data.body.artists.items, // artists is an object, while items is an array of objects, here we are creating an object for all the info of the artist
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
// Going on the same theory applied before but in this case the parameter is going to vary as we are passing the artis ID dynamically depending on the clicked parameter
// Artist id is retrieving the id and passing it as a param
app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      console.log(data.body);
      // Storing all the songs from the albums of the artist
      res.render("albums", { albums: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    //Passing the album id as a dynamic param with the get album method
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      console.log(data.body);
      //Sending to render an objects where the tracks are stored
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3400, () =>
  console.log("My Spotify project running on port 3400 🎧 🥁 🎸 🔊")
);
