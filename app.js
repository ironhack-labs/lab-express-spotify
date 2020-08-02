require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

const bodyParser = require("body-parser");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));

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

// // helper function
// hbs.registerHelper("getArtists", function (arrArtists) {
//    return arrArtists.reduce((ele))
// });

// Our routes go here:
// home page
app.get("/", (request, response) => {
  response.render("index.hbs");
});

app.get("/artistsearch", (request, response) => {
  spotifyApi
    .searchArtists(request.query.artistname)
    .then((data) => {
      // console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const artistsSrchRes = data.body.artists.items;
      response.render("artist-search-results.hbs", artistsSrchRes);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (request, response) => {
  // console.log(request.params.artistId);

  spotifyApi
    .getArtistAlbums(request.params.artistId)
    .then((data) => {
      // console.log("Artist albums", data.body.items);
      const albums = data.body.items;
      response.render("albums.hbs", albums);
      console.log("Artist albums", albums[0]);
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:albumId", (request, response) => {
  console.log(request.params.albumId);

  spotifyApi
    .getAlbumTracks(request.params.albumId, { limit: 5, offset: 1 })
    .then((data) => {
      console.log("  tracks: ", data.body);
      const tracks = data.body.items;
      console.log(" Albums tracks ", tracks);
      response.render("tracks.hbs", tracks);
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});

// server listening on port 30003
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
