// Load env vars
require('dotenv').config();

const express = require('express');

// Init configurations
require('./configs/hbs.config');
require('./configs/spotify.config');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

// Application routes
const routes = require('./configs/routes.config');
app.use('/', routes);

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));