require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
// Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:


// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artist-search', (req, res, next) =>{
    spotifyApi
    .searchArtists(req.query.artist) 
    .then(data => {
        console.log('The received data from the API: ', data.body.artists.items)
        data.body.artists.items.forEach((item) => 
        console.log(item.images))
        const artistsArray = data.body.artists.items
        res.render('artist-search-results', {artistsArray})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    const artistId = (req.params.artistId);
    spotifyApi.getArtistAlbums(artistId)
    .then(function(data) {
          console.log('Artist albums', data.body);
          const albums = data.body;
          res.render('albums', {albums})
        },
        function(err) {
          console.error(err);
        }
      );
  });

app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = (req.params.albumId)
    spotifyApi.getAlbumTracks(albumId)
    
  .then(function(data) {
    console.log('Album tracks', data.body);
    const tracks = data.body;
    res.render('tracks', {tracks})
  }, 
  function(err) {
    console.log('Something went wrong!', err);
  });
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
