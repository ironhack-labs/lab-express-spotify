var SpotifyWebApi = require('spotify-web-api-node');
const express = require("express")
const app = express()
const hbs = require("hbs")
const path = require("path")
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({
  extended: true
}))

app.set('view engine', 'hbs');

app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));

// Remember to paste here your credentials
var clientId = '1633eefda5d44f98a6b72d8ae8e5fea7',
  clientSecret = '04bc14936cfa46bb918f6d1d2cd8abfb';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

// console.log("carajo")
app.get('/', function(req, res) {
  res.render("home")
})

app.post("/artist", function(req, res) {
  let newArtist = req.body.newArtist
  console.log(newArtist)
  spotifyApi.searchArtists(newArtist)
    .then(data => {
      // console.log(data.body.artists.items[0].id)
      var artistName = data.body.artists.items[0].name
      var images = data.body.artists.items[0].images[1].url
      var artistId = data.body.artists.items[0].id

      res.render("artist", {
        artistInfo: artistName,
        image: images,
        artistId: artistId
      })
      // data.body.artists.items
    })
    .catch(err => {
      console.log(err);
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
})



app.get('/albums/:artistId', (req, res) => {
  // console.log(req)
  var artistId = req.params.artistId
  spotifyApi.getArtistAlbums(artistId).then(
    function(data) {
      // console.log(data.body.items)
      var albums = data.body.items
      var image = data.body.items

      res.render("albums", {
        albums: albums,
        image: image
      })
      // console.log(data.body.items[0].id);
      // console.log( allAlbums);
    },
    function(err) {
      console.error(err);
    }
  );

});

app.get('/tracks/:albumId', (req, res) => {
  var albumId = req.params.albumId
  spotifyApi.getAlbumTracks(albumId, { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body.items)
    var sound = data.body.href
    // var track1 = data.body.
    res.render("tracks", {sound: data.body.items})
    // console.log(data.body);
    // res.send(req.params)
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})



app.listen("3000", function() {
  console.log("server has Started")
})
