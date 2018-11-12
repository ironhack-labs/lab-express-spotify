var SpotifyWebApi = require('spotify-web-api-node');

var clientId = '233be0ff6eec4286a17021b15024c094',
    clientSecret = '4ebe953e39174dbd911d95544bf443ba';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");


app.set("view engine", "hbs");
//app.set('views', path.join(__dirname, 'views'));
app.set("views", __dirname + "/views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/favicon.ico", express.static('public/img/favicon.ico'));
hbs.registerPartials(__dirname + '/views/partials');

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
app.use("/favicon.ico", express.static('public/img/beer.ico'));
hbs.registerPartials(__dirname + '/views/partials');


app.get("/", (req, res, next) => {
  let data = {
    name: "home",
    home: true,
    error: false
  };
  res.render("home",{data});
});



app.get('/artists', (req, res, next) => {
  let data = {
    name: "artists",
    artists: true,
    found: false
  };
  if(req.query.artist.length > 0) {
    spotifyApi.searchArtists(req.query.artist)
      .then(result => {
        //console.log(result);
        data.consult = result.body.artists.items;
        data.found = data.consult.length <= 0 ? false : true;
        //data.artist = req.query.artist;
        res.render('artists', {data});
      })
      .catch(err => {res.send(err)});
  } else {
    let data = {
      name: "home",
      home: true,
      error: true
    };
    res.render("home",{data});
  }
});



app.get('/artists/:artistId/albums', (req, res, next) => {
  console.log(req.params);
  let data = {
    name: "albums",
    albums: true,
    found: false
  };
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(result => {
      data.consult = result.body.items;
      data.artistId = req.params.artistId;
      data.found = data.consult.length <= 0 ? false : true;
      res.render('albums', {data});
    })
    .catch(err => {res.send(err)});
});


app.get('/artists/:artistId/albums/:albumId/tracks', (req, res, next) => {
  let data = {
    name: "tracks",
    tracks: true,
    found: false
  };
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(result => {
      data.consult = result.body.items;
      //console.log(data.consult)
      //data.artistId = req.params.artistId;
      //data.albumId = req.params.artistId;
      data.found = data.consult.length <= 0 ? false : true;
      res.render('tracks', {data});
    })
    .catch(err => {res.send(err)});
});



let port = 3000;
app.listen(port, () => console.log(`Ready on http://localhost:${port}`))
