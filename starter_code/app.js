const express = require('express');
const hbs = require('hbs');
const path = require('path');
const musics = require('./routes/musics.routes');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }))

// the routes go here:
app.use('/', musics);

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
