const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
// Remember to insert your credentials here

const clientId = 'c8db7736550a4753b68575cb3da6d99c',
    clientSecret = 'c6f5e1a0f07144f1b15bf13ef0e73a66';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// the routes go here:

app.get('/', (req, res) => {
    res.render('index');
  });

app.get('/artist', (req, res) => {
    spotifyApi.searchArtists(req.query.nome)
    .then(data => {

      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      //res.render('artists', data.body);
      let arrayArt = data.body.artists.items;
      res.render('artists', {arrayArt})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get('/albums/:id', (req, res) => {
    // console.log(req.params.id);
    spotifyApi.getArtistAlbums(req.params.id).then(function(data) {
    //console.log('Artist albums', data.body);
    let arbum = data.body.items;
    res.render('album', {arbum})
  }, function(err) {
    console.error(err);
  });
});

app.get('/tracks/:id2', (req, res) => {
    //console.log(req.params.id2);
    spotifyApi.getAlbumTracks(req.params.id2)
    .then(function(data) {
      console.log(data.body.items);
      let trackos = data.body.items;
      res.render('tracks', {trackos})
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
