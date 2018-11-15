const SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');

const hbs = require('hbs');

const app = express();


const clientId = '46b54da592cb457e81cd31f44841e72c';
const clientSecret = 'bae1796f914e49efa54122868216ea4c';

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
});

spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body.access_token);
  }, (err) => {
    console.log('Something went wrong when retrieving an access token', err);
  });
