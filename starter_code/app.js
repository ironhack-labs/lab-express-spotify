const express = require('express');
const hbs = require('hbs')
const bodyParser  = require('body-parser')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}))

// the routes go here:
let index = require('./routes/index')
app.use('/', index)


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));