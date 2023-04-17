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

// Register partials to use them with handlebars
hbs.registerPartials(__dirname + "/views/partials");

// Our routes go here:

app.get("/", function (req, res) {
  console.log("Hello Spotify");
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const queryString = req.query.q;
  console.log(queryString);
  spotifyApi
    .searchArtists(queryString)
    .then((data) => {
      //   console.log("The received data from the API: ", data.body.artists.items);
      const artistList = data.body.artists.items;
      console.log(artistList);
      //   console.log(artistList[0].images);
      res.render("artist-search-results", { artistList });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  const params = req.params.artistId;
  spotifyApi
    .getArtistAlbums(params)
    .then((data) => {
      //   console.log(params);
      //   console.log("Artist albums", data.body.items);
      const albumList = data.body.items;
      console.log(albumList);
      //   console.log(albumList[0].images);
      res.render("albums", { albumList });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res, next) => {
  const params2 = req.params.albumId;
  spotifyApi
    .getAlbumTracks(params2)
    .then((data) => {
      //   console.log("Album tracks", data.body.items);
      const trackList = data.body.items;
      console.log(trackList);
      res.render("tracks", { trackList });
      console.log(data.body.items.artists);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Listen
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
