const express = require('express');
const app = express();
const hbs = require('hbs');
const album = require('./routes/album');
const artist = require('./routes/artist');
const track = require('./routes/track');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use('/artist', artist);
app.use('/album', album);
app.use('/track', track);

app.get("/", (req, res) => res.render("index"))


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));