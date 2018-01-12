var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '9f275de0ef5045b0bfb690054746a321',
  clientSecret = '611c9cfa2d9d40b4abe2829a7d9f01d5';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

var bodyParser = require('body-parser');

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/home', (request, res) => {
  res.render('home');
});
app.get('/', (request, res) => {
  res.render('home');
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.post('/home', function (req, res) {
  let artist = req.body.art;
  // Search artists whose name contains 'Love'
  spotifyApi.searchArtists(artist)
    .then(function (data) {
      console.log(data.body);
      console.log(`SEGUNDO JSON ${data.body.artists.items[0].name}`);
      console.log(data.body.artists.items[0]);

      res.render('artist', {
        artist: req.body.art,
        data: data.body
      });
    }, function (err) {
      console.error(err);
    });
});


app.get('/artist', (request, res) => {
  console.log("Hola");
  res.render('artist');
});

app.get('/albums/:artistId', (req, res) => {
  console.log(req.params.artistId);
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(function (data) {
      console.log('Artist albums', data.body.items[0]);
      res.render('albums', {
        data: data.body
      })
    }, function (err) {
      console.error(err);
    });
});

// app.get('/categories', (request, res, next) => {
//   if (request.query.cat === undefined) {
//     client.getJokeCategories()
//       .then((response) => {
//         let data = [];
//         for (let item of response) {
//           let link = "http://localhost:3000/categories?cat=" + item;
//           data.push(link);
//         }
//         let objData = {};
//         objData.links = data;
//         res.render('index', objData);
//       })
//       .catch((err) => {
//         // handle error
//       });
//   } else {
//     client.getRandomJoke(request.query.cat)
//       .then((response) => {
//         // use the response here
//         let objData = {};
//         objData.joke = response.value;
//         res.render('joke-by-category', objData);
//       }).catch((err) => {
//         // handle error
//       });
//   }
// });


// Server Started
app.listen(3000, () => {
  console.log('Server ONLINE!');
});