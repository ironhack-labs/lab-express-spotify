const express = require('express')
const hbs = require('hbs')
const path = require('path')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const app = express()

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

///////// SPOTIFY API START /////////

var SpotifyWebApi = require('spotify-web-api-node');

var clientId = '5ce9908f8b9a44e8b7a902ed54757c16',
  clientSecret = '21f027aa582d4673ba00a65da3a4dde8';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

///////// SPOTIFY API END /////////

app.get('/', function (req, res) {
  res.render('index')
});

app.get('/albums/:id', function (req, res, next) {
  const artistId = req.params.id;

  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      console.log(data.body.items)

      const albums = data.body.items.map(album => ({
        id: album.id,
        name: album.name,
        image: album.images[0].url
      }));

      res.render('albums', { albums });
    })
    .catch(err => {
      console.log("An error happend while looking for albums :", err);
    });
});

app.get('/tracks/:id', function (req, res, next) {
  const albumId = req.params.id;

  const options = {
    "headers": {
      "authorization": "Bearer BQC61XmSqejC_oR2z_bU_2sOieHZGiSYnJtWL-yOK0-khAydrpxT_BOexe39hlvJHqzZ5BAK8khAzf2bV57w9c4VCgrghyTCsJG9JmgHxG7Xjw40ztcY_KMaoh24sB2YzkGlGQtRjMU2TFgAo_6t0jUWqVAeoqcwdw",
    }
  };

  fetch('https://api.spotify.com/v1/albums/' + albumId + '/tracks', options)
    .then(data => {
      console.log("data", data)
      res.render('tracks', { data })
    })
    .catch(err => {
      console.log("While fetching tracks an error occure: ", err);
    });

});

app.post('/artists', function (req, res, next) {
  spotifyApi.searchArtists(req.body.artists)
    .then(data => {
      let artists = data.body.artists.items.map((artist) => ({
        id: artist.id,
        name: artist.name,
        image: artist.images[0] ? artist.images[0].url : null
      }));

      res.render('artists', { artists });
    })
    .catch(err => {
      console.log("An error occured while searching for artists: ", err);
    });
});

app.listen(3000, () => console.log('listening to port 3000'));