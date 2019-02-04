const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const clientId = "7bb930d785e94dd5934ad42372252988",
  clientSecret = "32894398b1444c3683073f8a0566f2a1";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// the routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

app.get("/", (request, response, next) => {
  response.render("index.hbs");
});

app.get("/artists", (request, response, next) => {
  const { artistList } = request.query;

  spotifyApi
    .searchArtists(artistList)
    .then(data => {
      // response.json(data);

      console.log("The received data from the API:", data.body);
      response.locals.artistElements = data.body.artists.items;
      response.render("artists.hbs");
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});
