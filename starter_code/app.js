const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: "true" }));

const clientId = "56d729bc378f487daccf1cb92f97a8fa",
  clientSecret = "96693b17f8f146a4a716c0422d9eaff5";

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
  response.render("index.hbs");
});

app.get("/artists", (request, response, next) => {
  const { artistInput } = request.query;
  spotifyApi
    .searchArtists(artistInput)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);

      response.locals.artistInput = data.body.artists.items;
      response.render("artists.hbs");
      // to assign a variable for something within the HBS file
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (request, response, next) => {
  const { artistId } = request.params;

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      console.log("The received data from the API: ", data.body.items);
      response.locals.albumsInput = data.body.items;
      response.render("albums.hbs");
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
