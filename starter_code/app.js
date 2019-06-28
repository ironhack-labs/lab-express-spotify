require('dotenv').config()
const prettyjson = require('prettyjson');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require("body-parser")
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: true}))
hbs.registerPartials(__dirname + "/views/partials")

// setting the spotify-api goes here:

const clientId = process.env.CLIENTUSER,
    clientSecret = process.env.CLIENTSECRET;

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


// the routes go here:

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/artists', (req, res) => {
  spotifyApi.searchArtists(req.body.artist)
    .then(data => {
      res.render('artists', data.body.artists)
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  console.log(req.body)
})

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    res.render('albums', data.body)
  }, function(err) {
    console.error(err);
  });
});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    console.log('Artist albums', data.body);
    res.render('tracks', data.body)
  }, function(err) {
    console.error(err);
  });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
