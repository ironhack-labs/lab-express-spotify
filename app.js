require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const routes = require('./routes/routesApp');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Our routes go here:
app.use('/', routes);

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
