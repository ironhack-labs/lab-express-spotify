const express = require('express')
const hbs = require('hbs')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));


///////// SPOTIFY API START /////////

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '5ce9908f8b9a44e8b7a902ed54757c16',
  clientSecret = '21f027aa582d4673ba00a65da3a4dde8';

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

///////// SPOTIFY API END /////////

app.get('/', function (req, res) {
  res.render('index')
})

app.post('/artists', function (req, res, next) {
  console.log(req.body.artists);

  spotifyApi.searchArtists(req.body.artists)
    .then(data => {

      artists = {
        search: req.body.artists,
        artists: data.body.artists.items,
      }
      console.log(artists)
      res.render('artists', artists);
    })
})
images: data.body.artists.items.images


app.listen(3000, () => console.log('listening to port 3000'));