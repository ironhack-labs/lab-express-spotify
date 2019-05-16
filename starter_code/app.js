const express = require('express');
const hbs = require('hbs');
const path = require('path')
// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//partials

hbs.registerPartials(__dirname + '/views/partials')


//express view engine set-up

app.set('view engine', 'hbs'); //para que renderize en hbs
app.set('views', path.join(__dirname, '/views')) //para que busque directamente dentro de views
app.use(express.static(path.join(__dirname, 'public'))) //para que renderize los enlaces como si public fuera su raiz


// the routes go here:
const index = require('./routes/index')
app.use('/', index)

const artist = require("./routes/artist")
app.use("/artist", artist)

const albums = require("./routes/albums")
app.use("/albums", albums)

const tracks = require("./routes/tracks")
app.use("/tracks", tracks)


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
