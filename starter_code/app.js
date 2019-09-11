require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

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


// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  let artist = req.query.artist;
  // console.log(artist);
  
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log(data.body.artists.items);
      res.render('artists', {artists: data.body.artists.items});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get('/albums/:id', (req, res, next) => {
  artistId = req.params.id;

  spotifyApi.getArtistAlbums(artistId)
    .then(function (data) {
      console.log(data.body.items);
      
      res.render('albums', { albums: data.body.items });
    }, function (err) {
      console.error(err);
    });
});

app.get('/tracks/:id', (req, res, next) => {
  albumId = req.params.id;

  spotifyApi.getAlbumTracks(albumId)
    .then(function (data) {
      console.log(data.body.items);
      // res.send(data.body.items);
      res.render('tracks', { tracks: data.body.items });
    })
    .catch(function (error) {
      console.error(error);
    });

});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
