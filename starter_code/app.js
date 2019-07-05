const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', (req,res) => {
  res.render('index')
});

app.get('/artists', (req,res) => {
  spotifyApi.searchArtists(req.query.artist)
  .then(data => {
    let music = data.body.artists.items;
    // console.log("The received data from the API: ", data.body);
    res.render('artists', {music})
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
    })
});


app.get('/albums/:id', (req,res) => {
  spotifyApi.getArtistAlbums(req.params.id).then(
    function(data) {
      let album = data.body.items;
      console.log('Artist albums', data.body.items);
      res.render('albums', {album})
    },
    function(err) {
      console.error(err);
    }
    );
  });
  
  app.get('/tracks/:id', (req,res) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then(data => {
      let albums = data.body.items;
      // console.log("The received data from the API: ", data.body);
      res.render('tracks', {albums})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
      })
  });
  // setting the spotify-api goes here:

const clientId = '34dc35977c6e45a59637950e1bd51a65',
    clientSecret = 'd607def369e14effbb7658ffe0960535';

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



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
