const express = require('express');
const artistRouter = require('./routes/artist.routes');
const albumRouter = require('./routes/album.routes');

const hbs = require('hbs');

// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:




// the routes go here:

app.get('/', (req, res, next) => {
  res.render('index');
});
app.use('/artist', artistRouter);
app.use('/albums', albumRouter);

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧  🥁  🎸  🔊"));
