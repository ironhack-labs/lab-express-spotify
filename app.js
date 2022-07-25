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
app.get("/", (req, res) => {
  res.render("home-page");
});

app.get("/artist-search", (req, res) => {
  const { search } = req.query; // define/ destructure a variable that can be used in this api request
  spotifyApi
    .searchArtists(search) // give the search query to the api request.
    .then((data) => {
      const artists = data.body.artists.items; // define a variable where you store the the endpoints you want to show and use in a other page
      console.log(artists);
      res.render("artist-search-results", { artists }); // render the artist results page if this request is successfull and give the query to this page to use this query for the search request of the api.
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:albumId", (req, res) => {
  const { albumId } = req.params; // create/destructure a variable to use the params of the url
  spotifyApi
    .getArtistAlbums(albumId) // pass the albumId as a parameter to the getArtist Api call.
    .then((data) => {
      const albums = data.body.items; // show all the items that is connected to the search in combination with the query we are sending
      res.render("albums", { albums }); // render the album page if the search is successfull. The albums variable is given to the render albums page.
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/view-tracks/:trackId", (req, res) => {
  const { trackId } = req.params; // use the parameter to get the actual id of the song of the album
  spotifyApi
    .getAlbumTracks(trackId) // pass the param trackId to the api method to be used on the page
    .then((data) => {
      const tracks = data.body.items; // get all itemd of the api request
      res.render("view-tracks", { tracks }); // pas the tracks variable to the view-tracks page
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
