const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

// Remember to paste here your credentials
var clientId = '545c564be843429eb66527d7fd4d0d31',
    clientSecret = 'e0e7e7b9ddae4735bf6ba6ae204a67e5';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', __dirname + '/views/layouts');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/',(req,res)=>{
  res.render('home');
});




// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.listen(3000, () =>{
  console.log('My first app listening on port 3000');
});
