require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// the routes go here:

app.get('/', (req, res) => {
  res.render('index');
})

// app.get('/artist', (req, res) => {
//   spotifyApi
//   .searchArtists(req.query.artists)
//   .then(responseFromApi =>
//     res.render('artist.hbs', {artist: responseFromApi})
//   .catch(error => console.log(error))
// )});

app.get('/artist', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(responseFromApi => 
      // console.log('Beers from the database: ', responseFromApi))
    res.render('artist', { artist: responseFromApi })
    // .catch(error => console.log(error))
// )
});

app.get('/album/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums('req.params.artistId')
    .then(
      function (data) {
        console.log('Artist albums', data.body);
      })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/track/:albumId', (req, res, next) => {
spotifyApi.getAlbumTracks('req.params.albumId', { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
