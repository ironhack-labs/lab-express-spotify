require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


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
    res.render('home.hbs');
});

app.get('/artists', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    const dataArtists = data.body.artists.items
    console.log(dataArtists[0].id);
    res.render('artists', {dataArtists})
  }).catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});

app.get('/albums/:artist_id', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artist_id)
  .then(data => {
    const albums = data.body.items
    console.log("Artist Albums", albums[0])
    res.render("albums", { albums })
  })
  .catch(err => {
    console.log(req.query.artist)
    console.log("The error while searching artists occurred: ", err);
  })
});

app.get('/tracks/:album_id', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.album_id)
  .then(data => {
    tracks = data.body.items;
    console.log(tracks[0].name);
    res.render('tracks', {tracks})
  })
  .catch(err => {
    console.log(req.query.artist)
    console.log("The error while searching artists occurred: ", err);
  })
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
