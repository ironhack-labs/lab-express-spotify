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
  clientSecret: process.env.CLIENT_SECRET
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

app.get("/", (req, res) => {
  res.render("home.hbs");
});

// the routes go here:

app.get("/artists", (req, res) => {
  let artistRequest = req.query.artistName;

  spotifyApi
    .searchArtists(artistRequest)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      //   res.send(data.body);
      let artistsArr = data.body.artists.items;
      res.render("artists", { artistList: artistsArr });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

app.get("/albums/:id", (req, res) => {
  //   let artistId = data.body.artists.items.id;
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      //   res.send(data.body);
      let albumArr = data.body.items;
      res.render("albums", { artistList: albumArr });
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    });
});

app.get("/tracks/:id", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then(data => {
      let tracks = data.body.items;
      console.log("tracks!!!", tracks);

      //   let allAlbumTracks = data.body.items.external_urls.spotify;
      //   res.send(data.body.items.external_urls.spotify);
      res.render("tracks", { artistList: tracks });
    })
    .catch(err => {
      console.log("The error while searching tracks occurred: ", err);
    });
});
