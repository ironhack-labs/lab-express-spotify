require("dotenv").config();

const express = require("express");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

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

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/artist-search-results", (req, res) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      res.render("artist-search-results", {
        artist,
        artists: data.body.artists.items,
      });
      console.log("[artist-search Page] The received data from the API: ", data.body);
      console.log(`
    [artist-search Page] Artist name is ${artist}
    `);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  console.log("[Albums page]Search for: ", {artistId});
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const Albums = data.body.items;
      console.log("result page should display", req.query);
      res.render("albums", {Albums});

      console.log("getArtistAlbums - The received data from the API: ", data);
      
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'  /albums/4243353?name='duc'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
  // .getArtistAlbums() code goes here
});

app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params;
  console.log("[Track page]Search for: ", {albumId});
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const tracks = data.body.items;
      console.log("result page should display", data);
      res.render("tracks", {tracks});

      console.log("getAlbumTracks - The received data from the API: ", data);
      
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
  // .getArtistAlbums() code goes here
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
