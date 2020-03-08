//const dotenv = require('dotenv');
//const googleApiKey = process.env.GOOGLE_API_KEY;

require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// require spotify-web-api-node package here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (req, res) => res.render('index'));

app.get('/search-artist', (req, res) => {
  const query = req.query; //this gives me an object with all the queries
  const artist = query.artist;

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      const artistList = data.body.artists.items;
      res.render('artists', { artistList });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

  //console.log(spotifyApi);
});

app.get('/albums/:id', (req, res) => {
  const id = req.params.id;

  spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      console.log(data.body.items);
      const albumsList = data.body.items;
      res.render('albums', { albumsList });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:albumId', (req, res) => {
  const albumId = req.params.albumId;
  console.log(albumId);

  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      console.log('this is body items', data.body.items);
      const albumsList = data.body.items;
      res.render('tracks', { albumsList });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
