var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.set('layout', __dirname + '/views/layout.hbs');

hbs.registerPartials(__dirname + '/views/partials');

// Remember to paste here your credentials
var clientId = 'f4bc6807f84d4e26ab9e4e2c8c7bfad7',
  clientSecret = '0f101cbeb64c42c2beb31e2c9560bfc2';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

// ____ routes
app.get('/', (request, response, next) => {
  response.render('home-page');
});

app.get('/artists', (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      // const chosenArtist = req.query.artist;
      // console.log('CAN I SEE SOME IMAGES?', data.body.artists.items[0].images[0].url);
      // res.send(req.query.artist);
      // console.log('wowowowowowo artist on query is ' + chosenArtist);
      res.render('artists', {
        name: data.body.artists.items[0].name,
        image: data.body.artists.items[0].images[0].url,
      });
    })
    .catch(err => {
      console.log('ERROR ERROR ARTIST IS NO FOUND IN DATA BASE WTF 😭', err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params)
    .then(data => {
      console.log('data album please', data);
      res.render('albums');
      // , {
      //   name: data.body.artists.items[0].name,
      //   image: data.body.artists.items[0].images[0].url,
      // });
    })
    .catch(err => {
      console.log('ERROR ERROR ALBUM IS NO FOUND IN DATA BASE WTF 😭', err);
    });
});
// ____ end routes

app.listen(3000, () => {
  console.log('App is running!');
});
