require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));


// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res, next) => {
  const artist = spotifyApi.searchArtists(req.query.artist);
  artist.then(data => {
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results', {
      data
    });
  });
  artist.catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistid', (req, res, next) => {
  const albums = spotifyApi.getArtistAlbums(req.params.artistid);
  albums.then(function (data) {
      res.render('albums', {
        data
      });
    },
    function (err) {
      console.error(err);
    }
  );
  albums.catch(error => console.log(error));
});

app.get('/tracks/:albumid', (req, res, next) => {
  const tracks = spotifyApi.getAlbumTracks(req.params.albumid);
  tracks.then(function (data) {
      res.render('tracks', {
        data
      });

    },
    function (err) {
      console.error(err);
    }
  );
  tracks.catch(error => console.log(error));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));