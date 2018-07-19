const express = require('express');
const path = require ('path');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join( __dirname, 'views'));

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));


// Remember to paste here your credentials
const clientId = '2c2b0f3b11444b18bc192396317f9a65',
    clientSecret = 'fb4700db9f3f4ce386c208c668f3e3bf';

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



app.get('/', (req, res, next) => {
  res.render('index');
});


app.get('/artists', (req, res, next) => {
  const artistSearched = req.query.artist;
  
  spotifyApi.searchArtists(artistSearched)
    .then( artists => {
      const data = {
        artists: artists.body.artists.items
      }
      res.render('artists', data);
    })
    .catch(err => {
      console.log('error');
    })
});

app.get('/albums/:id', (req, res) => {
  const { id } = req.params.id;
  console.log(id);

  spotifyApi.getArtistAlbums(id)
    .then ( id => {
    })
    .catch(err => {
      console.log('error');
    })

})

app.listen(3000);
