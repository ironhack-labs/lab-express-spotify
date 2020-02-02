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

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (request, response) => {
  console.log("working");
  response.render("index");
});

app.get("/artist-search", (request, response) => {
  //params if you want to get data from url
  //query if you want to get user input
  const userInput = request.query.artist; //Madonna

  spotifyApi
    .searchArtists(userInput)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
      response.render("artist-search-results.hbs", {
        artistList: data.body //
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});
//-----------------------------------------------------------------ALBUMS------------------
app.get("/albums/:artistId", (request, response) => {
  console.log("request.params", request.params.artistId);

  spotifyApi
    .getArtistAlbums(request.params.artistId)
    .then(data => {
      console.log(data.body);
      response.render("albums.hbs", { albumList: data.body.items });
    })
    .catch(err => console.log(err));
});

//-----------------------------------------------------------------TRACKS------------------

app.get("/tracks/:albumId", (request, response) => {
  console.log("request.params", request.params.albumId);
  spotifyApi
    .getAlbumTracks(request.params.albumId)
    .then(data => {
      console.log(data.body);
      response.render("tracks.hbs", { tracksList: data.body.items });
    })
    .catch(err => console.log(err));
});

//   spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
//     function(data) {
//       console.log('Artist albums', data.body);
//     },
//     function(err) {
//       console.error(err);
//     }
//   );

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
