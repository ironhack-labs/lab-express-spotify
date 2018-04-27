//imports
const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require("body-parser")
//config
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json());
//spotfy
var SpotifyWebApi = require('spotify-web-api-node');
// Remember to paste here your credentials
var clientId = '49839afc1549495282d29d9f685efad2',
    clientSecret = 'c1ce9d0e720b4836b2a55148978238d7';
var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret,
});
//Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});
//control
//gets
app.get('/', (req, res, next) => {
    res.render('home');
    
  });
  app.post('/artists', (req, res, next) => {

    spotifyApi.searchArtists(req.body.query)
    .then(data => {
      const Artistas = data.body.artists.items;
      console.log(Artistas[0].images[0])
      res.render('artists', {Artistas})
    })
    .catch(err => {
      console.log(err)
    });
  })
  app.listen(3000);