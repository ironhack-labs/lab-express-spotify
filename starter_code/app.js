var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");
const bodyparser = require('body-parser')

const app = express();
const path = require("path");
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(bodyparser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "public")));

hbs.registerPartials(__dirname + "/views/partials");

// Remember to paste here your credentials
var clientId = "88149fc50bff42b38bc28e2d8dacefb1",
  clientSecret = "34fba035418f47a8a7da28b2ff30718d";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);


//-----> VIEWS
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist", (req, res) => {
  const artistQuery = req.query.artist;
  // console.log(artistQuery);
  spotifyApi.searchArtists(artistQuery)
  .then(data => {
    const artistId = data.body.artists.items.id;
    // console.log(data.body.artists.items)
    res.render("artist", {
      obj: data.body.artists.items,
      artist: artistQuery
    });
  })
  .catch(err => {
    console.log("Error", err)
  })
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    res.render("albums", data.body);
    // console.log(data.body.items)
  })
  .catch(err => {
    console.log("Error", err)
  })
});

app.get('/tracks/:tracksId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.tracksId)
    .then((data)=>{
      res.render('tracks', data.body);
    }).catch((err)=>{
      console.log("Error", err);
    });
})


app.listen(3000);
