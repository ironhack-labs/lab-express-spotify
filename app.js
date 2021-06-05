require('dotenv').config();

const express = require('express');
const hbs = require('hbs');




const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


//Router
const router = require('./config/routes.config')
app.use('/', router)


// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
