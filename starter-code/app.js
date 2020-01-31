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

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
// Route for home page:
app.get("/", (request, response) => {
  console.log("/");
  response.render("index.hbs");
});
console.log(spotifyApi.getAccessToken());

// Route for the search results page:
app.get("/artist-search", (request, response) => {
  spotifyApi
    .searchArtists(request.query.artist /*'HERE GOES THE QUERY ARTIST'*/)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      response.render("artist-search-results.hbs", {
        artistList: data.body.artists.items
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Route for the albums page:
app.get("/albums/:artistId", (request, response) => {
  spotifyApi
    .getArtistAlbums(request.params.artistId)
    .then(data => {
      console.log("Artist albums", data.body);
      response.render("albums.hbs", {albumsList: data.body.items});
    })
    .catch(err => console.error(err));
});

// Route for the tracks page:
app.get("/tracks/:trackId", (request, response) => {
  spotifyApi
    .getAlbumTracks(request.params.trackId)
    .then(data => {
      console.log("Track list", data.body.items);
      response.render("tracks.hbs", { trackList: data.body.items });
    })
    .catch(err => console.error(err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
