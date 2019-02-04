const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

// setting the spotify-api goes here:
const clientId = "5500bd5bfef642d390ddf6b1ee6764e8",
  clientSecret = "19de1804fc124a7eb17a68cba7471719";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

//
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerPartials(__dirname + "/views/partials");
// the routes go here:

// HOMEPAGE/SEARCHBAR
app.get("/", (request, response, next) => {
  response.render("index.hbs");
});

// SEARCH RESULTS
app.get("/artists", (request, response, next) => {
  // response.send(request.query);

  const { search_query } = request.query;

  spotifyApi
    .searchArtists(search_query)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      // response.json(data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      response.locals.artist = data.body.artists.items;
      response.render("artists.hbs");
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

// GO TO AN ALBUM
app.get("/albums/:artistID", (request, response, next) => {
  const { artistID } = request.params;

  spotifyApi.getArtistAlbums(artistID).then(
    function(data) {
      console.log("Artist albums", data.body);
      // response.json(data.body);
      response.locals.album = data.body.items;
      response.render("albums.hbs");
    },
    function(err) {
      console.error(err);
    }
  );
});

// GO TO AN ALBUM'S TRACKS
app.get("/tracks/:albumID", (request, response, next) => {
  const { albumID } = request.params;

  spotifyApi.getAlbumTracks(albumID, { limit: 10, offset: 1 }).then(
    function(data) {
      console.log(data.body);
      // response.json(data.body);
      response.locals.track = data.body.items;
      response.render("tracks.hbs");
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );
});

// PORT INFO
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
