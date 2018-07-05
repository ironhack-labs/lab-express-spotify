const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

//Set Handlebars

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

// Remember to paste here your credentials
const clientId = '63aba2ab95c54b23b5118c38256c61fc',
    clientSecret = '8103d7eae20748d3b5bddc8674d6a0ab';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


// Control functions


app.get('/', (req, res, next) => {
  res.render('home');
});

app.get('/artist', (req, res, next) => {
  const searchName = req.query.artist;
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      data.body.artists.search = searchName;
      res.render('artist', data.body.artists);
    })
    .catch(err => {
      console.log('Error retrieving the data', err);
    })
  
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      console.log(data.body.items[0].artists[0].name);
      res.render('albums',data.body);
    })
    .catch(err => {
      console.log('Error retrieving the data', err);
    })
});

app.get('/tracks/:tracksId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.tracksId)
  .then(function(data) {
    res.render('tracks', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});


const port = 3000;
app.listen(port, () =>{
  console.log(`Working on https://localhost:${port}`)
});