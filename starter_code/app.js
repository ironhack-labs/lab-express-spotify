const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', __dirname + '/views/layout/home');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(express.static('public'));




var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '356b11ed3da546fdb68080dec63fc3c9',
    clientSecret = '52f925bdc7c344d3ac6f211e80be5b7f';

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

app.get('/',(req,res)=>{
  res.render('home');
});

// app.post('/artist',(req,res) => {
//   console.log("el body es: ");
//   console.log(req.body.searchArtist);
//   res.render('artist', {
//   });
// });



app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
