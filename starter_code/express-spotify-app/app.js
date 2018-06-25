var SpotifyWebApi = require('spotify-web-api-node');

const express = require("express");
const app = express();
const hbs = require("hbs");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const prettyjson = require("prettyjson");

app.set("view engine", hbs);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

//credentials
var clientId = "5d825c979e3c43b7a19cc6f83b1ef9d6",
  clientSecret = "8bcc134f958244a2b31812cd131ae12b";

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
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

app.get("/", (req, res, next) => {
  res.render("homepage.hbs");
});

app.get("/artists", (req, res, next) => {
  const {search_query} = req.query;
  spotifyApi.searchArtists(search_query)
    .then(data => {

      res.locals.artistsRes = data.body.artists.items;
      //res.send(data);
      res.render("layouts/artists.hbs")
      //console.log(`Search for ${req.query.search_query}`, artistsRes);
      console.log(data.body.artists.items);
    })
    .catch(err => {
      console.log(`Can't retreive artist :(`, err);
    });
});

app.get('/albums/:artistId', (req, res) => {
  const {artistId} = req.params;
  spotifyApi.getArtistAlbums(artistId)
  .then(data => {
    //res.send(data);
    res.locals.albumsRes = data.body.items
    res.render("layouts/albums-info.hbs")
  })
  .catch(err => {
    console.log(`Can't retreive album:(`, err);
  });
});

app.get('/albums/:artistId/tracks/:albumId', (req, res, next)=>{
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      //res.send(data)
      res.locals.trackResults = data.body.items;
      res.render("tracks.hbs")
    })
    .catch(err => {
      console.log("View tracks failed", err)
    })
})


app.listen(3000, () => {
  console.log("server listening!");
});
