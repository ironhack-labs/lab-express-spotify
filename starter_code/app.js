require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node")

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// the routes go here:

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then(data => {
      //console.log( JSON.stringify(data.body.artists.items));
      res.render('artists', {
        artists: data.body.artists.items
      })
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
})

app.get('/albums/:albumId', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.albumId)
    .then(data => {
      //console.log(data.body.items)
      //console.log(JSON.stringify(data.body.items[0].images))
      res.render('albums', {
        albums: data.body.items
      })
    })
    .catch(err => {
      console.log("The error while searching album occurred: ", err)
    })
})

app.get('/tracks/:trackId', (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.trackId)
    .then(data => {
      //console.log(data.body)
      res.render('tracks', {
        tracks: data.body.items
      })
    })
    .catch(err => {
      console.log("The error while searching album occurred: ", err)
    })
})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
