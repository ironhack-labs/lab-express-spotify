var SpotifyWebApi = require('spotify-web-api-node');
// Remember to paste here your credentials
var clientId = '9405011331584417ba9a0019c317448d',
    clientSecret = '9ab4a90804f0435e82ef7fb31893b70c';
var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

app.set('views', __dirname + '/views/layouts');
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', __dirname + '/views/layouts/home');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
.then(function(data) {
  spotifyApi.setAccessToken(data.body['access_token']);
}, function(err) {
  console.log('Something went wrong when retrieving an access token', err);
});

app.get('/',(req,res)=>{
  // console.log("la query es: ");
  // console.log(req.query);
  res.render('home');
});


app.listen(3000, () => {
  console.log('ironspotify app listening on port 3000!');
});
