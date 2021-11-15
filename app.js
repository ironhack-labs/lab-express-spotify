require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

//Middleware for the view engine

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

//Middleware for the public

app.use(express.static(__dirname + '/public'));

//Middleware for body-parser
app.use(express.json());
app.use(express.urlencoded({extended: false}))

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

app.get('/artist-search-results', (req, res) => {
  spotifyApi
      .searchArtists(req.query.artists)
      .then(data => {
          console.log('The received data from the API: ', data.body);
          res.render('artist-search-results',{artists:data.body.artists})
        })
      .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res,) => {
  spotifyApi
      .getArtistAlbums(req.params.artistId)
      .then(albums => {
        res.render('albums',{albums:albums.body})
      })
      .catch(err => console.log('The error while searching albums occurred: ', err));
})

app.get('/tracks/:albumId', (req, res,) => {
  spotifyApi
      .getAlbumTracks(req.params.albumId)
      .then(tracks => {
        res.render('tracks',{tracks:tracks.body})
      })
      .catch(err => console.log('The error while searching tracks occurred: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
