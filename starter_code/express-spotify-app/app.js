const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const prettyJson = require("prettyjson");

// init express
const app = express();

// Credentials
const clientId = "54133bec225543b6bdfeab601fb7dad5";
const clientSecret = "9fbc77836ef848c99f7946241d56b748";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  });

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + 'public'));

hbs.registerPartials( __dirname + '/views/partials/' );

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artists", (req, res) => {
  let {name} = req.query;

  spotifyApi.searchArtists(name)
  .then( artist => { 
      console.log(artist.body.artists.items); 
      let artists = artist.body.artists.items;
      res.render("artists", {artists});
    },
      err => console.log(err) );
})

app.get("/albums/:artistId", (req, res) => {
  let id = req.params.artistId;

  spotifyApi.getArtistAlbums(id)
  .then( album => {
    let albums = album.body.items; 
    console.log(albums);
    res.render("albums", {albums});
  },
    err => console.log(err) );
})

app.get("/tracks/:albumId", (req, res) => {
  let id = req.params.albumId;

  spotifyApi.getAlbumTracks(id)
  .then( track => {
    let tracks = track.body.items;
    console.log(tracks);
    res.render("tracks", {tracks} );
  },
    err => console.log(err) );
})

app.listen( 3000, () => console.log("Server started") );