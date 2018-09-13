const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path =require('path'); // ojo

// Remember to paste here your credentials
const clientId = '9cf4f5c16fe74e5a9eafdbfbc329850c',
    clientSecret = 'b3c42c37c54440afaea0abe5d5e6c71e';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.set('vie engine', 'hbs'); // ojo to set up
app.set('views', __dirname + '/views'); // para render
app.use(express.static(path.join(__dirname, 'public'))); // ojo static folder containing img, js, css
hbs.registerPartials(__dirname + '/views/partials'); // ojo parial

const bodyParser = require('body-parser'); // http path
app.use(bodyParser.urlencoded({ extended: true}));


// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/',(req,res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('Port 3000')
});