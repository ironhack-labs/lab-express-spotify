require('dotenv').config();
const bodyParser = require('body-parser')

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:


const app = express()


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));



// Retrieve an access token






// setting the spotify-api goes here:

// Our routes go here:

app.use("/", require('./routes'))

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
