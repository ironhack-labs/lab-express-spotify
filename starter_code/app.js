const express = require('express')
const hbs = require('hbs')

const app = express()

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// Partials
hbs.registerPartials(__dirname + '/views/partials')

// the routes go here:
app.use('/', require('./routes'))

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
