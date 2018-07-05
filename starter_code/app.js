'use strict';

const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const credentials = require('./credentials.js')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');