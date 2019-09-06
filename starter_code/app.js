const express = require('express');
const hbs = require('hbs');
require('dotenv').config()
const bodyParser = require('body-parser')

const PORT = process.env.PORT

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// the routes go here:
app.use('/', require('./routes'))

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`)
})

app.listen(PORT, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
