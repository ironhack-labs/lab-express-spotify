const express = require("express");
const app = express();
const hbs = require("hbs");

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const clientId = "fc5f35b9531a45c2ac213879d893f0da",
  clientSecret = "f787df2e7ff54b03bdedd08d8662ce67";

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

// the routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

// Routes
// ----------------------------------------------------------------------------------------------------------

app.get("/", (request, response, next) => {
  response.render("index.hbs");
});

app.get("/artists", (request, response, next) => {
  const { search_query } = request.query;
  spotifyApi.searchArtists(search_query).then(
    function(data) {
      response.locals.artistsData = data.body.artists.items;
      // response.json(data.body.artists.items);
      console.log("Artist albums", data);
      response.render("artists.hbs");
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get("/albums/:artistId", (request, response, next) => {
  const { artistId } = request.params;
  spotifyApi.getArtistAlbums(artistId).then(
    function(data) {
      response.locals.artistAlbumsId = data.body.items;
      console.log("Artist albums", data);
      // response.json(data.body.items);
      response.render("albums.hbs");
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:albumId", (request, response, next) => {
  const { albumId } = request.params;
  spotifyApi.getAlbumTracks(albumId).then(
    function(data) {
      response.locals.albumTrackId = data.body.items;
      console.log("Albums tracks", data);
      // response.json(data.body.items);
      response.render("tracks.hbs");
    },
    function(err) {
      console.error(err);
    }
  );
});
