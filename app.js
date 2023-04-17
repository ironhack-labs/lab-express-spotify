/* eslint-disable max-len */
/* eslint-disable arrow-parens */
// ------------------------------------------------------------
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
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then( data => spotifyApi.setAccessToken(data.body['access_token']) )
    .catch( error => {
      console.log('Something went wrong when retrieving an access token', error);
    });

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index');
});

// search for artists
app.get('/search-for-artist', (req, res) => {
  const searchString = req.query.artist;
  spotifyApi
      .searchArtists(searchString)
      .then( data => {
        const resolve = async () => {
          const searchResults = await data.body.artists.items;
          res.render('search-for-artist-results', {searchResults});
        };
        resolve();
      })
      .catch( err => console.log('The error while searching artists occurred: ', err) );
});

// show albums
app.get('/albums/:artistName/:artistId', (req, res) => {
  const artistName = req.params.artistName;
  const artistId = req.params.artistId;
  spotifyApi
      .getArtistAlbums(artistId)
      .then( data => {
        const resolve = async () => {
          const searchResults = await data.body.items;
          const filteredResults = searchResults.filter( album => album.album_type === 'album' && album.album_group === 'album' );
          res.render('albums', {filteredResults, artistName});
        };
        resolve();
      })
      .catch( err => console.log('The error while searching artists occurred: ', err) );
});


hbs.registerHelper('calculateSeconds', function(options) {
  const convertedTime = options.fn(this) / 1000 / 60;
  return convertedTime.toFixed(2);
});

// show tracks
app.get('/tracks/:albumName/:albumId', (req, res) => {
  const albumName = req.params.albumName;
  const albumId = req.params.albumId;
  spotifyApi
      .getAlbumTracks(albumId)
      .then( data => {
        const resolve = async () => {
          const searchResults = await data.body.items;
          res.render('tracks', {searchResults, albumName});
        };
        resolve();
      })
      .catch( err => console.log('The error while searching artists occurred: ', err) );
});

app.listen( 3000, () => {
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊');
});
