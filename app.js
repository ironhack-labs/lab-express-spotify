require('dotenv').config()

const hbs = require('hbs');

// require spotify-web-api-node package here:
//const SpotifyWebApi = require('spotify-web-api-node');

// Database
require('./configs/mongoose.config')

// Debugger
require('./configs/debugger.config')

// App
const express = require('express')
const app = express()

// Configs
require('./configs/preformatter.config')(app)
require('./configs/middleware.config')(app)
require('./configs/views.configs')(app)
require('./configs/locals.config')(app)

// Routes index
require('./routes')(app)

// setting the spotify-api goes here:

// const spotifyApi = new SpotifyWebApi({
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET
// });

// spotifyApi
//     .clientCredentialsGrant()
//     .then(data => spotifyApi.setAccessToken(data.body['access_token']))
//     .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

module.exports = app



