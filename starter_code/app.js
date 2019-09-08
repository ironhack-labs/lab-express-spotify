const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const clientId = "ef36ab4c99ad40c184ed49cbb8f2ef5a",
  clientSecret = "4c33697c40a24a62b0ea0dbd52ea09a4";

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

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artists", (req, res) => {
  //   console.log(req.query);
  spotifyApi
    .searchArtists(req.query.q)
    .then(data => {
      const artistsList = data.body.artists.items;
      //   console.log("The received data from the API: ", artistsList);
      const artistsFiltered = artistsList.filter(artist => {
        return artist.images.length > 0;
      });
      res.render("artists", {
        artistsToRender: artistsFiltered
      });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  const splitted = req.url.split("/");
  const artistId = splitted[splitted.length - 1];
  spotifyApi.getArtistAlbums(artistId).then(
    data => {
      console.log("Artist albums", data.body.items[0].images);
      const albumsList = data.body.items;
      res.render("albums", {
        albumsList: albumsList
      });
    },
    err => {
      ls;
      console.log("Error occured while searching for albums", err);
    }
  );
});

app.get("/tracks/:albumId", (req, res, next) => {
  const splitted = req.url.split("/");
  const albumId = splitted[splitted.length - 1];
  spotifyApi.getAlbumTracks(albumId, { limit: 5, offset: 1 }).then(
    data => {
      console.log(data.body.items);
      const tracksList = data.body.items;
      res.render("tracks", {
        tracksList: tracksList
      });
    },
    err => {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
