const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser')

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render('artists', {artists: data.body.artists.items});
      console.log(data.body.artists.items)  
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("Error al cargar el artista");
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
})

app.get('/album/:artistId', (req, res, next) => {
  console.log("holaaa")
  spotifyApi.getArtistAlbums(req.params.artistId)/*'HERE GOES THE QUERY ARTIST'*/
    .then(data => {
      res.render('album' , {album: data.body.items});
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("Error al cargar el album")
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
})

// Remember to paste here your credentials
const clientId = '8a38477ebae0463b83e6b08ba971cd79',
    clientSecret = '459aef7abc0a4ad3a6e600336cfb0a2b';

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

app.listen(4000);