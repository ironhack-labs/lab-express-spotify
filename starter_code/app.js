
const express = require('express');
const app     = express();
const hbs     = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');
const bodyParser = require("body-parser")
const clientId = 'f170f12caaae4f5badea5431c2fbe29f',
    clientSecret = 'fea41053d7eb46c9aad1420a9e3b151be';
const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + '/views/partials');

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => console.log("Connected"));
