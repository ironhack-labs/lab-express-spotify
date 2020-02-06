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
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => res.render('index'));

app.get('/albums/:artistId', (req, res, next) => {
spotifyApi
  .getArtistAlbums(req.params.artistId) 
  .then(albums => {
       res.render('albums', {albums:albums.body.items});
      // res.json(albums);
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId) 
    .then(tracks => {
         res.render('tracks', {tracks:tracks.body.items});
        //  res.json(tracks);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  });

app.get('/artist-search', (req, res) => {
  
  spotifyApi
  .searchArtists(req.query.busqueda)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results', {artists: data.body.artists.items})
    // res.json(data.body.artists.items);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
