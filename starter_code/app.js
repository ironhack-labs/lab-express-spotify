const express = require('express');
require('dotenv').config()
const hbs = require('hbs');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// the routes go here:
app.use('/', require('./routes'))

///
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`My Spotify project is running on : http://localhost:${PORT}`)
})