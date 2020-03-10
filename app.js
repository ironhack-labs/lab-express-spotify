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

// Filtering results to remove duplicate albums -- not finished yet
let spotifyAlbumFilter = arrayArg => {
  return (result = arrayArg.filter(el => {
    el.items.forEach(arelem => {
      if (arelem.available_markets.includes("NL")) {
        return arelem;
      }
    });
  }));
};

// Providing query object to handlebars pages
app.use(function(req, res, next) {
  const { query } = req.query;
  switch (req.path) {
    case "/artist-search":
      res.locals.info = query;
      break;
  }
  next();
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error => console.log("Something went wrong when retrieving an access token", error));

// Our routes go here:
app.get("/", (req, res) => {
  res.render("form");
});

app.get("/artist-search", (req, res) => {
  let { query } = req.query;
  if (query === "") {
    query = "Rick Asstley";
  }

  spotifyApi
    .searchArtists(query)
    .then(data => {
      //console.log("The received data from the API: ", data.body);
      res.render("artist-search-results", data.body);
    })
    .catch(err => {
      if (err.statusCode === 401) {
        spotifyApi;
      }
      console.log(`The error while searching artists occurred: ${err}`);
    });
});

app.get("/albums/:albumId", (req, res) => {
  const { albumId } = req.params;
  spotifyApi.getArtistAlbums(albumId).then(
    function(data) {
      //console.log(spotifyAlbumFilter(data.body));

      //res.render("albums-search-results", spotifyAlbumFilter(data.body));
      res.render("albums-search-results", data.body);
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:trackId", (req, res) => {
  const { trackId } = req.params;
  spotifyApi.getAlbumTracks(trackId).then(
    function(data) {
      res.render("tracklist-results", data.body);
    },
    function(err) {
      console.error(err);
    }
  );
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
