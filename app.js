require('dotenv').config();
const express = require('express');
const router = express.Router()
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

require("./config")(app)

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

const indexRoutes = require('./routes/index.routes')
app.use('/', indexRoutes)

module.exports = app;
