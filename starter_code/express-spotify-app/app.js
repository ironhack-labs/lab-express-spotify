const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();


app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', __dirname + '/views/layouts/home');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));


var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
const clientId = '1aeb28b4d404496d9ce0937112d74329';
const clientSecret = '6a2ef4050df34a93b457c729040ee6a7';

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

app.get('/',(req,res)=>{
  console.log("Go to home");
  res.render('home');
});

app.listen(3000,()=>{
   console.log('My first app listening on port 3000!');
});
