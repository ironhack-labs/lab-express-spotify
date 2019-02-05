const express = require("express");
const hbs = require("hbs");

const app = express();

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const clientId = "ca32eef6352044f7a90c32e6e07df5a9",
  clientSecret = "b6a9e47693554c9abb84831e3f9cdfd6";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", err);
  });

// Routes
// ----------------------
// ######################

app.get("/", (request, response, next) => {
  response.render("index.hbs");
});

app.get("/artists", (request, response, next) => {
  const { search_query } = request.query;

  spotifyApi
    .searchArtists(search_query)
    .then(data => {
      //response.json(data);
      console.log("The received data from the API: ", data.body);
      //response.locals.artistsList = search_query;

      response.locals.artistsList = data.body.artists.items; //.name;

      response.render("artists.hbs");
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:ArtistId", (request, response, next) => {
  //const { artistId } = request.params.ArtistId;
  //response.send(request.params.ArtistId);
  //response.send(request.params.ArtistId);

  spotifyApi.getArtistAlbums(request.params.ArtistId).then(
    function(data) {
      console.log("Artist albums", data.body.items);

      //response.json(data);

      response.locals.albumList = data.body.items;
      response.render("albums.hbs");
    },
    function(err) {
      console.error(err);
    }
  );
});
