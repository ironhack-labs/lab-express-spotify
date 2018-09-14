const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require("path");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(path.join(__dirname, "public")));

var SpotifyWebApi = require('spotify-web-api-node');
const port = 3000;
// Remember to paste here your credentials
var clientId = '6ea7f81b4f7f4b2789f4d039cd046e77',
  clientSecret = '10478fcb8c0b4d56b9e0fbadcffe0ae7';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(err => {
    console.error(err);
  });

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist", (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render("artist", {
        data
      });
    })
    
});
app.get("/albums/:id", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id)
    .then(data => {
      res.render("albums", {
        data
      });
    })
    .catch(err => {
      console.error(err);
    });
});
app.get("/tracks/:id", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id)
    .then(data => {
      res.render("tracks", {
        data
      });
    })
    .catch(err => {
      console.log('Something went wrong!', err);
    });
});


app.listen(port, () => {
  console.log(`Port ${port}`);
})