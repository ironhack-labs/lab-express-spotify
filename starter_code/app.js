var SpotifyWebApi = require('spotify-web-api-node');

// My Credentials to connect with the API
var clientId = '32b37c52347645008746a05864ad8c48',
  clientSecret = 'b5ad69b5d478449c9afcececf99fc248';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
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
/* require modules */
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const bodyParser = require('body-parser');
//Con esto le decimos que vamos a utilizar el bodyParser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* Middlewares config */

app.use(expressLayouts);
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/main-layout');
app.set('view engine', 'ejs');
app.use(express.static('public'));

/* Routes */

app.get('/', (req, res, next) => {
  res.render('index');
});

app.listen(3000, () => console.log('Ready!'));
