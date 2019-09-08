const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:

// Remember to insert your credentials here
const clientId = "af517b5ef4484b92a4c17e9eb4329213",
  clientSecret = "dfeddeb0b9824d7ebd35ef666cab4db4";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
// spotify-web-api-node documentation
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

app.get("/", (req, res) => {
  res.render("index.hbs");
});

app.get("/artist", (req, res) => {
  let artist = req.query.search;

  // spotify-web-api-node documentation
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items[0]
      );
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let artistList = data.body.artists.items;
      res.render("artists", { artistList });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  // .getArtistAlbums() code goes here

  const albums = req.params.artistId;

  // spotify-web-api-node documentation
  spotifyApi
    .getArtistAlbums(albums, { limit: 10, offset: 20 })
    .then(function(data) {
      console.log("Album information", data.body.items);

      const albumList = data.body.items;
      res.render("albums", { albumList });
    })
    .catch(err => {
      console.error(err);
    });
});

app.get("/tracks/:trackList", (req, res) => {
  const tracks = req.params.trackList;

  spotifyApi
    .getAlbumTracks(tracks)
    .then(function(data) {
      console.log(data.body.items);

      const tracksList = data.body.items;

      res.render("tracks", { tracksList });
    })
    .catch(err => {
      console.log("Something went wrong!", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
