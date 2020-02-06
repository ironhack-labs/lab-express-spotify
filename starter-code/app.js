require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(path.join(__dirname, 'views', 'partials'))

app.use('/', require('./routes/index.routes'))

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
