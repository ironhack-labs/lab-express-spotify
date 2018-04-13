var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste here your credentials
var clientId = "af3c2403fc0a4284aa9ea8a30724d5cd",
  clientSecret = "9aa7dca518b343a7bb40ec28707bea35";

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

//code for exercice

const express = require("express");
const app = express();
const hbs = require("hbs");

// app.use(express.static(path.join(__dirname, "public"))); Do I need that ??
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.set("layout", __dirname + "/views/layout.hbs");
hbs.registerPartials(__dirname + "/views/partials");

//routes
//------------------------------------------------
//HP route
app.get("/", (req, res, next) => {
  res.render("home-page");
  // console.log("home page ok");
});

//route artist search
app.get("/artist", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      // console.log(data.body.artists.items[0].images[0].url);
      console.log(data.body.artists.items[0].id);
      res.render("artist", {
        data: data
      });
    })
    .catch(err => {
      console.log("Error" + err);
    });
});

//route albums
app.get('/albums/:artistId', (req, res, next) => {

  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    res.render("albums", {
      data: data
    });
    // console.log('Artist albums', data.body.items);
  }, function(err) {
    console.error(err);
  });

});

//route tracks
app.get("/tracks/:albumId", (req, res, next) =>{

  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    res.render("tracks", {
      data: data
    });
    console.log(data.body.items[0].preview_url);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

});



//------------------------------------------------
app.listen(3000, () => {
  console.log("App is running");
});
