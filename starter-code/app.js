require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const mongoose = require("mongoose");
const bodyParser = require ("body-parser")
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


// Our routes go here:
let index = require('./routes/index')
app.use("/", index)

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
