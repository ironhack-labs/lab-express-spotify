const express = require("express");
const app = express();
const hbs = require("hbs");

var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste here your credentials
var clientId = "e51c61019c4a404d8c00de8fb2fb2efc",
  clientSecret = "fcc72abf5c6c4c0991163d8f29a9595b";

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

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

app.get("/", (req, res, next) => {
  res.render("index");
});
app.get("/artists", function(req, res) {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
     let artists = data.body.artists.items;
     console.log(artists)
      res.render("artists", {artists});
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    });
    app.get("/albums/:artistId", function(req, res) {
      let id = req.params.artistId;
       spotifyApi.getArtistAlbums (id)
        .then(album => {
         let albums = album.body.items;
         console.log(albums)
          res.render("album", {albums});
        })
        .catch(err => {
          // ----> 'HERE WE CAPTURE THE ERROR'
        });
      
  
});
})
const port = 3000;
app.listen(port, () => console.log(`Connected to ${port}`));
