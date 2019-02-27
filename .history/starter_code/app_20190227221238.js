const express = require('express');
const hbs = require('hbs');
const Spotify = require('spotify-web-api-js');
const spoty = new Spotify();

// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:






// the routes go here:
const index = require('./routes/index');
app.use('/', index);


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
