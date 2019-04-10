const express = require('express');
const hbs = require('hbs');
const indexRouter= require ('./routes/index');
const artistRouter= require ('./routes/artist');
const app = express();
//const spotifyApi= require('../config/db.config.js')




// configurate router:
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// the routes go here:
app.use('/', indexRouter);
app.use('/artist', artistRouter);



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
