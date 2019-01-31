const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: "b9c95fe380774c778ff2bf886260c44d",
  clientSecret: "fa6ec647ec7e47ed85209ce14bf907d0"
});

// Retrieve an access token.
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artists)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
      const artists = data.body.artists.items;
      res.render("artists", { artists });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:id", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      //console.log("The received data from the API: ", data.body);
      const albums = data.body.items;
      res.render("albums", { albums });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/tracks/:id", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      const tracks = data.body.items;
      res.render("tracks", { tracks });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
