// Iteration 1 | Spotify API Setup
require('dotenv').config();
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
// Iteration 2 | Express Setup
const express = require('express');
const hbs = require('hbs');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// The routes go here:
// Iteration 3 | Search for an Artist
// Step 1 | Create a Homepage
//Home page
app.get('/', (req, res, next) => {
  res.render('index', { title: 'My Spotify | Home' });
});

//Step 2 | Display results for artist search
//Search for artists from home page - type name and  submit
app.get('/artists', (req, res, next) => {
  // res.send(req.query.artist);
  spotifyApi
    .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/ req.query.artist)
    .then(data => {
      // console.log('The received data from the API: ', data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let {
        artists: { items },
      } = data.body;
      // console.log('artists', data.body.artists.items);
      res.render('artists', { items, typeOf: 'albums' });
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
});

//Iteration 4 | View Albums
//albums
app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      // console.log(data.body);
      let { items } = data.body;
      // console.log(items);
      res.render('albums', { items, typeOf: 'tracks' });
    })
    .catch(err => console.log(err));
});

//Iteration 5 | View Tracks
//tracks
app.get('/tracks/:trackId', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.trackId)
    .then(data => {
      const { items } = data.body;
      // console.log(items);
      res.render('tracks', { items });
    })
    .catch(err => console.log(err));
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
