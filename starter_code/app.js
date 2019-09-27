require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:



// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});

app.listen(3001, () => console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊"));
