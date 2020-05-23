const express = require('express');
const hbs = require('hbs');
const homeRouter = require('./routes/homeRouter');
const artistRouter = require('./routes/artistRouter');
const albumRouter = require('./routes/albumRouter');
const trackRouter = require('./routes/trackRouter');

//initialize server
const app = express();

//middleware routes
app.use('/', homeRouter);
app.use('/artist-search', artistRouter);
app.use('/albums', albumRouter);
app.use('/tracks', trackRouter);

app.use(express.static(__dirname + '/public'));

//settings
app.set('view engine', 'hbs');

// Server listener
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
