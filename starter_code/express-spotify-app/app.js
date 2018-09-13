const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');

const clientId = '02d11ea571ac4574a9b78134e6135685',
    clientSecret = 'e1eab7ee07994192986c1c6d7c7d2217';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.set('view options', { layout: '/layouts/layout' });


// // Retrieve an access token.
// spotifyApi.clientCredentialsGrant()
//   .then(function(data) {
//     spotifyApi.setAccessToken(data.body['access_token']);
//   }, function(err) {
//     console.log('Something went wrong when retrieving an access token', err);
// });

app.get('/', (req, res) => {
    res.render(`home`);
});


app.listen(3000);