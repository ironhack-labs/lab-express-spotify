const express = require('express');
const path = require('path');
const morgan = require('morgan');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const port= 3000;
const app = express(); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const route = require('./routes/spotify.js');
app.use('/search', route);

app.listen(port, () => console.log("Listening...")); 