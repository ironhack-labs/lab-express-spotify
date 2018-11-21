const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

var morgan = require('morgan')
app.use(morgan('combined'))

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/", require("./routes/home.js"))
app.use("/", require("./routes/artists.js"))
app.use("/", require("./routes/albums.js"))
app.use("/", require("./routes/tracks.js"))

app.listen(3000)