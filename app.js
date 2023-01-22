require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
const router = require("./config/routes.config");
app.use(router);

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
