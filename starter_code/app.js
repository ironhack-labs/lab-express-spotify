const express = require('express');
const app = express();
const PORT = 3000;

const mongoose = require('mongoose');
const path = require('path');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '5c06cda28631421c996a311f1a529b2e',
    clientSecret = '8128710f4402495892034495ff4ac7e9';

const spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token'])) 
  .catch(err => console.log('Something went wrong when retrieving an access token', err));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.listen(PORT, () => {
    console.info('Holi');
});
