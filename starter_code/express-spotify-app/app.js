const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const SpotifyWebApi = require("spotify-web-api-node");

hbs.registerPartials(__dirname + "/views/partials");

const clientId = "67dbae35cdef44c8a84c49cc91827db4",
  clientSecret = "b156016d45c54a7c8ae643a23360fc5f";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", `${__dirname}/views`);
app.set("view engine", "hbs");

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

let artist;

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist", (req, res) => {  
  artist = req.query.artist
  spotifyApi
    .searchArtists(artist)
    .then(artist => {
      let data = {
        name: req.query.artist,
        artists :  artist.body.artists
      }
      res.render("artist", data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  let artistId = req.params.artistId;  
  spotifyApi.getArtistAlbums(artistId)
  .then(artistId => {
    res.render("albums", artistId)
  })
  .catch(err => {
    console.log(err);
  })

})

app.get("/tracks/:albumId", (req, res) => {
  let albumId = req.params.albumId;
  spotifyApi.getAlbumTracks(albumId)
  .then(albumId => {
    res.render("tracks", albumId)
  })
  .catch(err => {
    console.log(err);
  })
})


const port = 3000;
app.listen(port, () => console.log(`Conected to port ${port}`));
