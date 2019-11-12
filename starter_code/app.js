require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

require('./config/spotifyApi.config');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const router = require('./config/routes.js');
app.use('/', router);





// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
