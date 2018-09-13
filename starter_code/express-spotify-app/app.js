const express = require("express");
const hbs = require("hbs");
const app = express();
const path = require("path");
var SpotifyWebApi = require("spotify-web-api-node");

app.set("view engine", "hbs");
app.set("views", __dirname + "/public/views");
app.use(express.static(path.join(__dirname, "public")));
hbs.registerPartials(__dirname + "/views/partials");

// Remember to paste here your credentials COPIED
var clientId = "d7629b6bee4b41d9a89d9448428a284e",
  clientSecret = "88208ef34ed24152a95fa23f7e6f53ca";

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

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        let artists = data.body.artists.items;
        res.render("artists", {artists});
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            let artistAlbums = data.body.items;
            //console.log('Artist albums', data.body.items);
            res.render('albums', {artistAlbums});
        })
        .catch(err => {
          // ----> 'HERE WE CAPTURE THE ERROR'
        })
});

app.get('/tracks/:albumId', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(data => {
            let albumTracks = data.body.items;
            console.log('Album tracks', data.body.items);
            res.render('tracks', {albumTracks});
        })
        .catch(err => {
          // ----> 'HERE WE CAPTURE THE ERROR'
        })
});

app.listen(3000);
