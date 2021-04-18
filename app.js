require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
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
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/artist-search', (req, res) => {
    spotifyApi
    .searchArtists(req.query.search)
    .then(data => {
      res.render('artist-search-results', {artists: data.body.artists.items});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});
 
app.get('/albums/:artistId', (req, res) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    //console.log('Albums: ', data.body.items);
    const albums = data.body.items.map((album) => {
      return {
        name: album.name,
        image: album.images.length === 0 ? 'images.placeholder_sotify.png' : album.images[0].url,  
        id: album.id,
      }
    })
    res.render('albums', {albums});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(data => {
    //console.log('Tracks: ', data.body);
    const tracks = data.body.items.map((track) => {
      return {
        name: track.name,
        preview_url: track.preview_url,  
        id: track.id,
      }
    })
    res.render('trackList', {tracks});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
