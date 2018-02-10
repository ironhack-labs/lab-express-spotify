const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const app = express();

const clientId = 'c2d8719c60fd46a8825a5395e2a54e65';
const clientSecret = '47fb2fd922124df3ba91596af53e6b2e';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));


spotifyApi.clientCredentialsGrant()
  .then( (data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, (err) => {
    console.log('Something went wrong when the retrieving an access token', err);
  });

app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/artists', (req, res, next) => {
  let userSearch = req.body.artist;
  spotifyApi.searchArtists(userSearch).then((result) => {
    let artists = result.body.artists.items;
    res.render('artists', {artists});
  });
});

// app.get('/albums/:userId', (req, res, next) => {
//   let artistAlbum = req.params.userId;
//   // console.log('param = ', artistAlbum);
//   spotifyApi.getArtistAlbums(artistAlbum, { limit: 10, offset: 20 }, (err, data) => {
//     if (err) {
//       console.error('Something went wrong!', err);
//     } else {
//       console.log(data.body);
//     }
//   });  
// });

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then((response) => {
    const albums = response.body.items;
    res.render('albums', {
      albums
    });
  }).catch(function (err) {
    console.log(err);
  });
});












app.listen(3000, () => {
  console.log('Server iniciado en http://localhost:3000');
});