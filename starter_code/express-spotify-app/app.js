const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyparser = require('body-parser')
var SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



// Remember to paste here your credentials
var clientId = '3218d9910e094d9d9a465e02c7487f4e',
    clientSecret = '6436a12537084b1d8f03f10cedc153c6';

var spotifyApi = new SpotifyWebApi({
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

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist', (req, res) => {
  const {art} = req.query; 

  spotifyApi.searchArtists(art)
    .then(data => {
      console.log(data.body.artists.items)
      res.render('artist-list',{data:data.body.artists.items});
    })
    .catch(err => {
      console.log(error)
    })
})

app.get('/albums/:artistId', (req, res) => {
  console.log(req.params.artistId)

  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log(data)
    res.render('artist-albums',{data:data.body.items});
  })
  .catch(err => {
    console.log(err)
  })

});

const port = 3000;
app.listen(port, () => console.log(`Ready on http://localhost:${port}`));