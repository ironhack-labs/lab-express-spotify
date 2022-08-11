require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
// app.use(express.urlencoded({ extended: false }));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
// console.log(process.env.CLIENT_ID);
// console.log(process.env.CLIENT_SECRET);

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    //console.log("The access token is " + data.body["access_token"]);
    spotifyApi.setAccessToken(data.body["access_token"]);
  })

  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (request, response) => {
  response.render("home-page");
});

app.get("/artist-search", (req, res) => {
  const { artistName } = req.query;

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      //console.log("The received data from the API: ", data.body.artists.items);

      const allArtistsData = data.body.artists.items;

      console.log(allArtistsData[0].images);

      res.render("artist-search-result", {
        allArtistsData,
      });
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:sushi", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.sushi).then((data) => {
    console.log("data:", data.body);
    const artistName = data.body.items[0].artists[0].name;

    res.render("album-search", { albums: data.body.items, artistName });
  });
});

app.get("/tracks/:albumId", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then((data) => {
    console.log("data:", data.body.items);
    res.render("tracks", { tracks: data.body.items });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
