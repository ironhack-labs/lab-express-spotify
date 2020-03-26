require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const spotifyApi = require('./spotifyApi');

// require spotify-web-api-node package here:



const appRoutes = require('./routes/appRoutes');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use('/', appRoutes);


  


// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
