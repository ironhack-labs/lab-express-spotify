const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
// require spotify-web-api-node package here:

// Remember to insert your credentials here
const clientId = "fe2b4239ce1946a381522de608407766",
  clientSecret = "4f0a89c6d7b74c11a9396c2517e490bf";

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

app.get("/", (req, res) => {
  res.render("index.hbs");
});

app.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      console.log(data.body);
      res.render("tracks.hbs", { tracks: data.body.items });
    })
    .catch(err => {
      console.log("Something went wrong!", err);
    });
});

// setting the spotify-api goes here:

app.get("/artists", (req, res) => {
  console.log(req.query.name);
  spotifyApi
    .searchArtists(req.query.name)
    .then(data => {
      console.log("The received data from the API: ", data.body);

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let artists = data.body.artists.items;

      res.render("artists", { artists });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  // burdaki artistId olayı her değişen albm adı için olucak ve urlde o ad gözükücek
  console.log(req.params.artistId);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      //   res.json(data.body);
      console.log("Artist albums", data.body);

      res.render("albums", { albums: data.body.items });
    })
    .catch(err => {
      console.error(err);
    });
});

// the routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
