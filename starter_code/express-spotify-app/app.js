var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('views'));

app.set('views', __dirname + '/views/layouts');
app.set('view engine', 'hbs');

// Remember to paste here your credentials
var clientId = 'c025bec0045c46a1b1a5207059348ea1', clientSecret = '9b2b38fe085b4f8b83d6c90746a99963';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});


// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
.then(function(data) {
  spotifyApi.setAccessToken(data.body['access_token']);
  // console.log(data);
}, function(err) {
  console.log('Something went wrong when retrieving an access token', err);
});



app.get('/', (req, res, next) => {
  res.render('index');
});

app.post("/artists", (req, res, next) => {

  spotifyApi.searchArtists(req.body.artist)
    .then(data => {
      console.log(data.body.artists.items);
      res.render('artists', {artists: data.body.artists.items})
    })
    .catch(err => {
      console.log('Something went wrong when retrieving an access token', err);
    })
  
  
})

app.listen(3000, () => {
  console.log("Port 3000")
});