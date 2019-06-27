const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const clientId = "c87a444a3c054b5e892f522ca3eca034",
  clientSecret = "c8e32949e12740839767cc0ae7a8f560";

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
app.get("/", (request, response, next) => {
  response.render("index");
});

app.get("/artists", (request, response, next) => {
  let search = request.query.search;
  spotifyApi
    .searchArtists(search)
    .then(data => {
      response.render("artists", {
        search: search,
        artists: data.body.artists.items
      });
    })
    .catch(err => console.log("Something bad happened"));
});

app.get("/albums/:artistId", (request, response, next) => {
  
  console.log("!!!!!!!!" + request.params);
  spotifyApi.getArtistAlbums(request.params.artistId).then(data => {
    response.render("list-albums", {
        albums: data.body.items,
        artistName: "TODO"
    });
  });
});

app.get("/tracks/:trackId", (request, response, next) => {
    spotifyApi.getAlbumTracks(request.params.trackId).then(data => {
        response.render("list-tracks", {
            tracks: data.body.items
        });
    });
});

app.listen(3000, () => {
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊");
});
