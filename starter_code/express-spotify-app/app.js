
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));

app.use(logger(`dev`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerPartials(`${__dirname}/views/partials`);

const SpotifyWebApi = require('spotify-web-api-node');

const clientId = 'b03d76b8bdef4d92a9ea20d8f652b452',
    clientSecret = 'b39f5c2936d44cad84a7a6f68432e7d3';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get("/artists", (req, res) => {
  let search = req.query.artist;

  spotifyApi.searchArtists(search)
    .then(data => {
      let artists = data.body.artists.items;
      // res.json(artists);
      res.render("artists", {artists});
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/albums/:id', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id)
    .then(data => {
      let albums = data.body.items;
      // res.json(albums);
      res.render("albums", {albums});
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/tracks/:id', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id)
    .then(data => {
      let tracks = data.body.items;
      // res.json(tracks);
      res.render("tracks", {tracks});
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(3000, () => {
  console.log("Running on :3000");
});