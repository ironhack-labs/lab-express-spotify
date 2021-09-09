require('dotenv').config();

const { Router } = require('express');
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
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index', {title:'Home'});
});

app.get('/artist-search', (req, res) => {
  const artistName = req.query.artist;
  spotifyApi
    .searchArtists(artistName)
    .then(data => {
      const searchResults = data.body.artists.items;
      res.render('artist-search-results', { results :searchResults, title: 'Artist search'})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res)=>{
  const artistId = req.params.artistId
  spotifyApi.getArtistAlbums(artistId)
  .then(data => {
        const albumsArr = data.body.items // get array of the albums of given artist
        res.render('albums', {albums : albumsArr, doctitle : 'Albums'} )
      })
  .catch(err => console.log('The error while searching albums occurred: ', err));
})

app.get('/tracks/:albumId', (req, res) => {
  const albumId = req.params.albumId;
  spotifyApi.getAlbumTracks(albumId)
      .then(data => {
          const tracks = data.body.items; //get tracks array
          // tracks.forEach(track => console.log(track.preview_url))
          res.render('tracks', {tracks : tracks, doctitle : 'Tarcks'} )
      })
      .catch(err => console.log('The error while searching track occurred: ', err));
  });




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
