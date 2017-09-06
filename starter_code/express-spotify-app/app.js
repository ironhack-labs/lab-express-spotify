/*jshint esversion: 6 */
const express = require('express');
const app = express();
const _ = require('lodash');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '5ee9ee85821e4e248a0734343734a1e4', clientSecret = '3d655565dcc74b7ea2646b93c5ef54a3';
const spotifyApi = new SpotifyWebApi({clientId: clientId, clientSecret: clientSecret});
app.use(expressLayouts);
app.set('layout', 'public/main-layout');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');


spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log("holi, entre en clientCredentialsGr");
    spotifyApi.setAccessToken(data.body['access_token']); //access.token cambiarlo por access_token
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.get('/', (req, res) => {
  console.log("Me ha llegado la pregunta.");
  res.send('main');
  });






app.listen(3000, () => {
  console.log(`My first app listening on port 3000!`);
});
