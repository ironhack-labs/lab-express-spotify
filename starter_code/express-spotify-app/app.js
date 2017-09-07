const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
const clientId = '44010391e08c4ed88f1db7339ed9601b',
    clientSecret = '34194b9295f8401f9905ea8719bf5862';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.use(express.static('public'));
app.use(expressLayouts);

app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});




app.listen(3000, () => console.log("I'm running!"));
