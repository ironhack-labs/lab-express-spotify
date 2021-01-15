require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
require('./configs/hbs.config')

app.use(express.static(__dirname + '/public'));

// MIDWARE

app.use(express.urlencoded({ extended: true }));

// setting the spotify-api goes here:

const router = require('./configs/routes.config');
app.use('/', router)


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`My Spotify project running on port ${port}!!!`));
