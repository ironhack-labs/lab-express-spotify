require('dotenv').config();

const express = require('express');

//Init configurations
require('./configs/hbs.config');
require('./configs/api.config');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
const routes = require ("./configs/routes.config");
app.use('/', routes);

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
