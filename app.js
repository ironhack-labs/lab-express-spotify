const express = require('express');
const ejs = require('ejs');
const path = require('path')
const app = express();
const expressLayouts = require('express-ejs-layouts');
const router = require('./router')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(expressLayouts)

// Our routes go here:
app.use('/', router)
app.use('/artists', router)
app.use('/albums', router)
app.use('/player', router)


app.listen(3000, () => console.log('My Spotify project running on port 30000 - http://localhost:3000/ 🎧 🥁 🎸 🔊'));