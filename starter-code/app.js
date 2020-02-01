require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (request, response) => {
  response.render("index.hbs");
});

app.get("/artist-search", (request, response) => {
  console.log(request.query.title);

  spotifyApi
    .searchArtists(request.query.title)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      response.render("artist.hbs", {
        artist: data.body.artists.items
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:albumId", (request, response) => {
  spotifyApi
    .getArtistAlbums(request.params.albumId)
    .then(data => {
      console.log("Artist albums:", data.body);
      response.render("albums.hbs", {
        albums: data.body.items
      });
      nodemo;
    })
    .catch(err => {
      console.log(err);
    });
});
app.get("/tracks/:tracksId", (request, response) => {
  spotifyApi
    .getAlbumTracks(request.params.tracksId)
    .then(data => {
      console.log("tracks:", data.body);
      response.render("tracks.hbs", {
        tracks: data.body.items
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
